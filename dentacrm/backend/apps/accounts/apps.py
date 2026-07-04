"""AppConfig for the ``accounts`` app."""
from __future__ import annotations

from django.apps import AppConfig


class AccountsConfig(AppConfig):
    """Users, OTP codes, and JWT authentication."""

    default_auto_field = "django.db.models.BigAutoField"
    name = "apps.accounts"
    label = "accounts"
    verbose_name = "Accounts"
