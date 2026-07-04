"""URL routes for the accounts app under ``/api/v1/auth/``."""
from __future__ import annotations

from django.urls import path

from .views import LoginView, MeView, TokenRefreshView

app_name = "accounts"

urlpatterns = [
    path("login/", LoginView.as_view(), name="login"),
    path("refresh/", TokenRefreshView.as_view(), name="refresh"),
    path("me/", MeView.as_view(), name="me"),
]
