"""Root URL configuration for DentaCRM.

The API is versioned under ``/api/v1/`` and every app registers its own
router / URLconf via ``config.urls`` include statements added as the app
comes online in subsequent build tasks.
"""
from __future__ import annotations

from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.http import JsonResponse
from django.urls import include, path
from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularRedocView,
    SpectacularSwaggerView,
)


def healthcheck(_request):
    """Simple liveness endpoint used by docker healthchecks."""
    return JsonResponse({"status": "ok", "service": "dentacrm-backend"})


# ---------------------------------------------------------------------------
# API v1
# ---------------------------------------------------------------------------
# App URL includes are appended here as new apps come online. Each entry
# is a real, importable urls module — no dangling includes.
api_v1_patterns: list = []


urlpatterns = [
    # Admin (Django-admin is kept enabled so bosh_shifokor can inspect data
    # during development; secured behind ADMIN_URL in prod via env).
    path("admin/", admin.site.urls),

    # Health check
    path("healthz/", healthcheck, name="healthz"),

    # OpenAPI / Swagger
    path("api/schema/", SpectacularAPIView.as_view(), name="schema"),
    path(
        "api/docs/",
        SpectacularSwaggerView.as_view(url_name="schema"),
        name="swagger-ui",
    ),
    path(
        "api/redoc/",
        SpectacularRedocView.as_view(url_name="schema"),
        name="redoc",
    ),

    # Versioned API
    path("api/v1/", include((api_v1_patterns, "v1"), namespace="v1")),
]


# Serve media/static in dev — production uses nginx/S3.
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
