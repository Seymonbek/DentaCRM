"""AppConfig for the ``scheduling`` app."""
from __future__ import annotations

from django.apps import AppConfig


class SchedulingConfig(AppConfig):
    """Navbatlar (Appointments) app configuration."""

    default_auto_field = "django.db.models.BigAutoField"
    name = "apps.scheduling"
    label = "scheduling"
    verbose_name = "Scheduling"
