"""Production settings for DentaCRM.

Enforces DEBUG=False, secure cookies, HSTS, S3/MinIO storage backend.
"""
from __future__ import annotations

from .base import *  # noqa: F401,F403
from .base import SECRET_KEY, SIMPLE_JWT, env_bool, env_int, env_list, env_str

# ---------------------------------------------------------------------------
# Debug + hosts
# ---------------------------------------------------------------------------
DEBUG = False

ALLOWED_HOSTS = env_list(
    "DJANGO_ALLOWED_HOSTS",
    default=[],  # MUST be set explicitly in prod.
)
if not ALLOWED_HOSTS:
    raise RuntimeError(
        "DJANGO_ALLOWED_HOSTS must be set in production (comma-separated)."
    )

# ---------------------------------------------------------------------------
# Fail loudly if secrets are still the insecure development defaults.
# Prevents accidentally deploying with the checked-in fallback key which
# would let anyone forge JWTs.
# ---------------------------------------------------------------------------
if not SECRET_KEY or SECRET_KEY.startswith("insecure-"):
    raise RuntimeError(
        "DJANGO_SECRET_KEY must be set to a real value in production."
    )
if not SIMPLE_JWT.get("SIGNING_KEY") or SIMPLE_JWT["SIGNING_KEY"].startswith(
    "insecure-"
):
    raise RuntimeError(
        "JWT signing key must be set (via DJANGO_SECRET_KEY) in production."
    )

# ---------------------------------------------------------------------------
# Security headers
# ---------------------------------------------------------------------------
SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")
SECURE_SSL_REDIRECT = env_bool("DJANGO_SECURE_SSL_REDIRECT", default=True)
SECURE_HSTS_SECONDS = env_int("DJANGO_SECURE_HSTS_SECONDS", 60 * 60 * 24 * 365)
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True
SECURE_CONTENT_TYPE_NOSNIFF = True
SECURE_REFERRER_POLICY = "same-origin"

SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True

# ---------------------------------------------------------------------------
# Storage — media via S3/MinIO
# ---------------------------------------------------------------------------
STORAGES = {
    "default": {
        "BACKEND": "storages.backends.s3.S3Storage",
        "OPTIONS": {
            "bucket_name": env_str("S3_BUCKET_MEDIA", "dentacrm-media"),
            "endpoint_url": env_str("S3_ENDPOINT_URL", ""),
            "access_key": env_str("S3_ACCESS_KEY", ""),
            "secret_key": env_str("S3_SECRET_KEY", ""),
            "region_name": env_str("S3_REGION", "us-east-1"),
            "addressing_style": "path",
            "querystring_auth": False,
            "file_overwrite": False,
        },
    },
    "staticfiles": {
        "BACKEND": "django.contrib.staticfiles.storage.ManifestStaticFilesStorage",
    },
}

# ---------------------------------------------------------------------------
# Logging — WARNING baseline in prod
# ---------------------------------------------------------------------------
LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": {
        "verbose": {"format": "%(asctime)s %(levelname)s %(name)s %(message)s"},
    },
    "handlers": {
        "console": {
            "class": "logging.StreamHandler",
            "formatter": "verbose",
        },
    },
    "root": {"handlers": ["console"], "level": env_str("DJANGO_LOG_LEVEL", "WARNING")},
}

# ---------------------------------------------------------------------------
# Sentry (optional)
# ---------------------------------------------------------------------------
_sentry_dsn = env_str("SENTRY_DSN", "")
if _sentry_dsn:  # pragma: no cover - runtime-only
    import sentry_sdk
    from sentry_sdk.integrations.celery import CeleryIntegration
    from sentry_sdk.integrations.django import DjangoIntegration

    sentry_sdk.init(
        dsn=_sentry_dsn,
        integrations=[DjangoIntegration(), CeleryIntegration()],
        traces_sample_rate=float(env_str("SENTRY_TRACES_SAMPLE_RATE", "0.0")),
        send_default_pii=False,
    )
