"""Celery application factory for DentaCRM.

Follows the pattern documented at
https://docs.celeryq.dev/en/stable/django/first-steps-with-django.html

The Django settings are read via ``DJANGO_SETTINGS_MODULE`` (defaults to
``config.settings.dev``) and every registered app's ``tasks.py`` is
auto-discovered.
"""
from __future__ import annotations

import os

from celery import Celery

# Ensure Django settings are available before the Celery app is instantiated.
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings.dev")

app = Celery("dentacrm")

# Read Celery-specific config from Django settings, using the CELERY_ prefix.
app.config_from_object("django.conf:settings", namespace="CELERY")

# Auto-discover tasks in every INSTALLED_APPS app that has a tasks module.
app.autodiscover_tasks()


@app.task(bind=True, ignore_result=True)
def debug_task(self) -> None:  # pragma: no cover - trivial debug helper
    """Emit self-request info; used for smoke-testing Celery wiring."""
    print(f"Request: {self.request!r}")
