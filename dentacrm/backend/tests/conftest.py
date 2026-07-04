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
"""
from __future__ import annotations

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
