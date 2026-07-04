"""Base Django settings for DentaCRM (shared between dev and prod).

Environment-specific settings live in ``config.settings.dev`` and
``config.settings.prod`` — those modules import from this one via
``from .base import *  # noqa: F401,F403``.

All secrets and environment-dependent values are read from environment
variables (never hard-coded). Docker-compose passes them through
``env_file: .env``.
"""
from __future__ import annotations

import os
from datetime import timedelta
from pathlib import Path
from typing import Any

import dj_database_url

# ---------------------------------------------------------------------------
# Paths
# ---------------------------------------------------------------------------
# BASE_DIR points at backend/ (the directory containing manage.py).
BASE_DIR = Path(__file__).resolve().parent.parent.parent


# ---------------------------------------------------------------------------
# Small env helpers (avoid pulling extra deps like django-environ)
# ---------------------------------------------------------------------------
def env_str(name: str, default: str = "") -> str:
    return os.environ.get(name, default)


def env_bool(name: str, default: bool = False) -> bool:
    raw = os.environ.get(name)
    if raw is None:
        return default
    return raw.strip().lower() in {"1", "true", "yes", "y", "on"}


def env_int(name: str, default: int) -> int:
    raw = os.environ.get(name)
    if raw is None or raw == "":
        return default
    try:
        return int(raw)
    except ValueError:
        return default


def env_list(name: str, default: list[str] | None = None, sep: str = ",") -> list[str]:
    raw = os.environ.get(name)
    if raw is None or raw == "":
        return list(default or [])
    return [item.strip() for item in raw.split(sep) if item.strip()]


# ---------------------------------------------------------------------------
# Core
# ---------------------------------------------------------------------------
SECRET_KEY = env_str(
    "DJANGO_SECRET_KEY",
    "insecure-dev-key-change-me-do-not-use-in-production",
)
DEBUG = env_bool("DJANGO_DEBUG", default=False)
ALLOWED_HOSTS = env_list(
    "DJANGO_ALLOWED_HOSTS",
    default=["localhost", "127.0.0.1", "backend"],
)
CSRF_TRUSTED_ORIGINS = env_list(
    "DJANGO_CSRF_TRUSTED_ORIGINS",
    default=["http://localhost:5173", "http://localhost"],
)

ROOT_URLCONF = "config.urls"
WSGI_APPLICATION = "config.wsgi.application"
ASGI_APPLICATION = "config.asgi.application"

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"


# ---------------------------------------------------------------------------
# Installed apps
# ---------------------------------------------------------------------------
DJANGO_APPS: list[str] = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
]

THIRD_PARTY_APPS: list[str] = [
    "rest_framework",
    "rest_framework_simplejwt",
    "rest_framework_simplejwt.token_blacklist",
    "drf_spectacular",
    "django_filters",
    "corsheaders",
    "simple_history",
    "django_celery_beat",
    "django_celery_results",
    "storages",
]

# Local apps are added as they come online in subsequent build tasks.
# Each entry MUST correspond to a real ``apps/<name>/apps.py`` config to
# keep ``manage.py check`` green.
LOCAL_APPS: list[str] = []

INSTALLED_APPS = DJANGO_APPS + THIRD_PARTY_APPS + LOCAL_APPS


# ---------------------------------------------------------------------------
# Middleware
# ---------------------------------------------------------------------------
MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "corsheaders.middleware.CorsMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.locale.LocaleMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
    "simple_history.middleware.HistoryRequestMiddleware",
]


# ---------------------------------------------------------------------------
# Templates
# ---------------------------------------------------------------------------
TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [BASE_DIR / "templates"],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]


# ---------------------------------------------------------------------------
# Database
#
# Prefer DATABASE_URL when set (docker-compose default). Fall back to
# individual POSTGRES_* vars, and finally to SQLite so that tooling like
# ``manage.py check`` and unit tests can run without a live Postgres.
# ---------------------------------------------------------------------------
_database_url = env_str("DATABASE_URL", "")
if _database_url:
    DATABASES: dict[str, dict[str, Any]] = {
        "default": dj_database_url.parse(
            _database_url,
            conn_max_age=env_int("DJANGO_DB_CONN_MAX_AGE", 60),
            conn_health_checks=True,
        )
    }
elif env_str("POSTGRES_HOST"):
    DATABASES = {
        "default": {
            "ENGINE": "django.db.backends.postgresql",
            "NAME": env_str("POSTGRES_DB", "dentacrm"),
            "USER": env_str("POSTGRES_USER", "dentacrm"),
            "PASSWORD": env_str("POSTGRES_PASSWORD", "dentacrm"),
            "HOST": env_str("POSTGRES_HOST", "postgres"),
            "PORT": env_str("POSTGRES_PORT", "5432"),
            "CONN_MAX_AGE": env_int("DJANGO_DB_CONN_MAX_AGE", 60),
            "CONN_HEALTH_CHECKS": True,
        }
    }
else:
    # Local fallback — enables ``manage.py check`` / ``migrate`` outside
    # Docker and inside the CI sanity job before Postgres is available.
    DATABASES = {
        "default": {
            "ENGINE": "django.db.backends.sqlite3",
            "NAME": BASE_DIR / "db.sqlite3",
        }
    }


# ---------------------------------------------------------------------------
# Password validation (minimal — real auth is JWT-based, not sessions)
# ---------------------------------------------------------------------------
AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]


# ---------------------------------------------------------------------------
# Internationalisation (Uzbekistan)
# ---------------------------------------------------------------------------
LANGUAGE_CODE = "uz"
TIME_ZONE = "Asia/Tashkent"
USE_I18N = True
USE_TZ = True

LANGUAGES = [
    ("uz", "Oʻzbekcha"),
    ("ru", "Русский"),
    ("en", "English"),
]
LOCALE_PATHS = [BASE_DIR / "locale"]


# ---------------------------------------------------------------------------
# Static & media
# ---------------------------------------------------------------------------
STATIC_URL = "/static/"
STATIC_ROOT = BASE_DIR / "staticfiles"
STATICFILES_DIRS: list[Path] = []

MEDIA_URL = "/media/"
MEDIA_ROOT = BASE_DIR / "media"

# Storage backends (S3/MinIO overridden in prod.py; dev keeps local FS).
STORAGES = {
    "default": {"BACKEND": "django.core.files.storage.FileSystemStorage"},
    "staticfiles": {
        "BACKEND": "django.contrib.staticfiles.storage.StaticFilesStorage",
    },
}


# ---------------------------------------------------------------------------
# REST Framework
# ---------------------------------------------------------------------------
REST_FRAMEWORK: dict[str, Any] = {
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    ),
    "DEFAULT_PERMISSION_CLASSES": (
        "rest_framework.permissions.IsAuthenticated",
    ),
    "DEFAULT_PAGINATION_CLASS": "rest_framework.pagination.PageNumberPagination",
    "PAGE_SIZE": 20,
    "DEFAULT_FILTER_BACKENDS": (
        "django_filters.rest_framework.DjangoFilterBackend",
        "rest_framework.filters.SearchFilter",
        "rest_framework.filters.OrderingFilter",
    ),
    "DEFAULT_SCHEMA_CLASS": "drf_spectacular.openapi.AutoSchema",
    # Standard error envelope (implemented in apps/core in T3).
    "EXCEPTION_HANDLER": "rest_framework.views.exception_handler",
    "DEFAULT_RENDERER_CLASSES": (
        "rest_framework.renderers.JSONRenderer",
    ),
    "DEFAULT_PARSER_CLASSES": (
        "rest_framework.parsers.JSONParser",
        "rest_framework.parsers.MultiPartParser",
        "rest_framework.parsers.FormParser",
    ),
    "TEST_REQUEST_DEFAULT_FORMAT": "json",
}

# In T3 the exception handler is replaced with the standard-envelope version:
#   REST_FRAMEWORK["EXCEPTION_HANDLER"] = "apps.core.exceptions.custom_exception_handler"
# In T3 the pagination class is replaced with:
#   REST_FRAMEWORK["DEFAULT_PAGINATION_CLASS"] =
#       "apps.core.pagination.StandardResultsSetPagination"


# ---------------------------------------------------------------------------
# JWT (simplejwt)
# ---------------------------------------------------------------------------
SIMPLE_JWT: dict[str, Any] = {
    "ACCESS_TOKEN_LIFETIME": timedelta(minutes=env_int("JWT_ACCESS_TTL_MINUTES", 15)),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=env_int("JWT_REFRESH_TTL_DAYS", 7)),
    "ROTATE_REFRESH_TOKENS": True,
    "BLACKLIST_AFTER_ROTATION": True,
    "AUTH_HEADER_TYPES": ("Bearer",),
    "USER_ID_FIELD": "id",
    "USER_ID_CLAIM": "user_id",
    "SIGNING_KEY": env_str("DJANGO_SECRET_KEY", SECRET_KEY),
    "ALGORITHM": "HS256",
}


# ---------------------------------------------------------------------------
# drf-spectacular (Swagger / OpenAPI)
# ---------------------------------------------------------------------------
SPECTACULAR_SETTINGS: dict[str, Any] = {
    "TITLE": "DentaCRM API",
    "DESCRIPTION": (
        "Tish klinikalari uchun to'liq CRM tizimi. "
        "Backend: Django 5 + DRF. Auth: JWT (Bearer)."
    ),
    "VERSION": "0.1.0",
    "SERVE_INCLUDE_SCHEMA": False,
    "COMPONENT_SPLIT_REQUEST": True,
    "SCHEMA_PATH_PREFIX": "/api/v1/",
    "SWAGGER_UI_SETTINGS": {
        "deepLinking": True,
        "persistAuthorization": True,
        "displayOperationId": False,
    },
    "SERVERS": [
        {"url": "http://localhost:8000", "description": "Local dev"},
    ],
    "TAGS": [
        {"name": "auth", "description": "Authentication endpoints"},
        {"name": "departments", "description": "Departments"},
        {"name": "doctors", "description": "Doctor profiles"},
        {"name": "patients", "description": "Patients"},
        {"name": "scheduling", "description": "Appointments"},
        {"name": "treatments", "description": "Treatments & odontogram"},
        {"name": "inventory", "description": "Materials & stock"},
        {"name": "payments", "description": "Payments & commissions"},
        {"name": "ratings", "description": "Doctor ratings & badges"},
        {"name": "reports", "description": "Aggregated reports"},
    ],
}


# ---------------------------------------------------------------------------
# CORS
# ---------------------------------------------------------------------------
CORS_ALLOWED_ORIGINS = env_list(
    "DJANGO_CORS_ALLOWED_ORIGINS",
    default=["http://localhost:5173", "http://localhost"],
)
CORS_ALLOW_CREDENTIALS = True


# ---------------------------------------------------------------------------
# Cache (Redis)
# ---------------------------------------------------------------------------
_redis_url = env_str("REDIS_URL", "redis://redis:6379/0")
CACHES = {
    "default": {
        "BACKEND": "django.core.cache.backends.redis.RedisCache",
        "LOCATION": _redis_url,
        "TIMEOUT": 300,  # 5 min default TTL; reports override where needed.
        "KEY_PREFIX": "dentacrm",
    }
}


# ---------------------------------------------------------------------------
# Celery
# ---------------------------------------------------------------------------
CELERY_BROKER_URL = env_str("CELERY_BROKER_URL", "redis://redis:6379/1")
CELERY_RESULT_BACKEND = env_str("CELERY_RESULT_BACKEND", "redis://redis:6379/2")
CELERY_ACCEPT_CONTENT = ["json"]
CELERY_TASK_SERIALIZER = "json"
CELERY_RESULT_SERIALIZER = "json"
CELERY_TIMEZONE = TIME_ZONE
CELERY_ENABLE_UTC = True
CELERY_TASK_TRACK_STARTED = True
CELERY_TASK_TIME_LIMIT = 5 * 60
CELERY_BEAT_SCHEDULER = "django_celery_beat.schedulers:DatabaseScheduler"


# ---------------------------------------------------------------------------
# Storage (S3/MinIO) — dev keeps FileSystemStorage; prod.py overrides.
# ---------------------------------------------------------------------------
AWS_ACCESS_KEY_ID = env_str("S3_ACCESS_KEY", "")
AWS_SECRET_ACCESS_KEY = env_str("S3_SECRET_KEY", "")
AWS_STORAGE_BUCKET_NAME = env_str("S3_BUCKET_MEDIA", "dentacrm-media")
AWS_S3_ENDPOINT_URL = env_str("S3_ENDPOINT_URL", "http://minio:9000")
AWS_S3_REGION_NAME = env_str("S3_REGION", "us-east-1")
AWS_S3_ADDRESSING_STYLE = "path"
AWS_QUERYSTRING_AUTH = False
AWS_S3_FILE_OVERWRITE = False


# ---------------------------------------------------------------------------
# Telegram (bot token read from env; empty in dev = mocked sender in T22).
# ---------------------------------------------------------------------------
TELEGRAM_BOT_TOKEN = env_str("TELEGRAM_BOT_TOKEN", "")
TELEGRAM_WEBHOOK_URL = env_str("TELEGRAM_WEBHOOK_URL", "")


# ---------------------------------------------------------------------------
# Logging (structured; INFO in dev, WARNING in prod)
# ---------------------------------------------------------------------------
LOGGING: dict[str, Any] = {
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": {
        "verbose": {
            "format": "%(asctime)s %(levelname)s %(name)s %(message)s",
        },
    },
    "handlers": {
        "console": {
            "class": "logging.StreamHandler",
            "formatter": "verbose",
        },
    },
    "root": {
        "handlers": ["console"],
        "level": env_str("DJANGO_LOG_LEVEL", "INFO"),
    },
    "loggers": {
        "django": {
            "handlers": ["console"],
            "level": env_str("DJANGO_LOG_LEVEL", "INFO"),
            "propagate": False,
        },
        "celery": {
            "handlers": ["console"],
            "level": "INFO",
            "propagate": False,
        },
    },
}


# ---------------------------------------------------------------------------
# Simple-history configuration
# ---------------------------------------------------------------------------
SIMPLE_HISTORY_REVERT_DISABLED = True
