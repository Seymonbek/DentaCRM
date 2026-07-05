"""Shared pytest fixtures for the backend test suite.

Runs before Django's setup so ``settings`` mutations here take effect for
every test module.

Notes
-----
* ``CACHES`` is switched to :class:`~django.core.cache.backends.locmem.LocMemCache`
  so tests that touch ``django.core.cache.cache`` (e.g. the reports app)
  don't require a live Redis. Domain apps that read/write through the
  regular ORM are unaffected.
* We deliberately do NOT change ``CELERY_TASK_ALWAYS_EAGER`` here — apps
  that need eager tasks (rare) can toggle it via ``@override_settings``.
* T118: the login endpoint is now rate-limited via
  :class:`~rest_framework.throttling.ScopedRateThrottle`. Its counters
  live in the default cache — which is LocMemCache under tests and
  therefore process-scoped, not test-scoped. The autouse
  ``_clear_default_cache`` fixture below resets it between tests so a
  test that fires several login attempts (e.g. ``test_clinic_flow``
  which logs in as three roles) cannot accidentally leak throttle
  state into the next test. Dedicated throttling tests in
  ``test_throttling.py`` exercise the limit intentionally within a
  single test function.
"""
from __future__ import annotations

import pytest
from django.conf import settings


def pytest_configure(config):  # noqa: ARG001 — pytest hook signature
    """Swap Redis cache for LocMemCache so tests don't need Redis."""
    settings.CACHES = {
        "default": {
            "BACKEND": "django.core.cache.backends.locmem.LocMemCache",
            "LOCATION": "dentacrm-tests",
            "TIMEOUT": 300,
            "KEY_PREFIX": "dentacrm",
        }
    }


@pytest.fixture(autouse=True)
def _clear_default_cache():
    """Reset the default cache before every test.

    Two use cases depend on this:

    1. **Throttling isolation** (T118) — the ``ScopedRateThrottle`` on
       ``/auth/login/`` records request counts in the default cache
       keyed by client IP. Without a reset, six independent login tests
       from the same ``127.0.0.1`` client would spill over the ``5/min``
       burst and start returning 429.
    2. **Reports cache isolation** — the reports app caches aggregate
       payloads under stable keys; wiping between tests avoids stale
       reads across cases that mutate underlying data.
    """
    # Local import so pytest can collect this module without Django set up.
    from django.core.cache import cache

    cache.clear()
    yield
    cache.clear()
