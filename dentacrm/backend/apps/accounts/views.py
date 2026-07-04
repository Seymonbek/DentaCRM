"""Authentication views: login, refresh, and self-profile.

We deliberately do **not** reuse ``rest_framework_simplejwt.views``
because we need our own error envelope, camelCase field aliases, and
extra token claims. All three endpoints share the standard error
envelope produced by :func:`apps.core.exceptions.custom_exception_handler`.
"""
from __future__ import annotations

from typing import Any

from drf_spectacular.utils import OpenApiExample, extend_schema
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.exceptions import (
    InvalidToken,
    TokenError,
)
from rest_framework_simplejwt.tokens import RefreshToken

from .serializers import (
    LoginSerializer,
    TokenRefreshInputSerializer,
    UserProfileSerializer,
)


class LoginView(APIView):
    """POST /api/v1/auth/login/ — exchange phone+password for a token pair."""

    authentication_classes: list[Any] = []
    permission_classes = [AllowAny]

    @extend_schema(
        tags=["auth"],
        summary="Login (phone + password)",
        request=LoginSerializer,
        examples=[
            OpenApiExample(
                "Example login body",
                value={"phoneNumber": "+998901234567", "password": "..."},
                request_only=True,
            ),
        ],
        responses={200: None, 400: None},
    )
    def post(self, request: Request) -> Response:
        serializer = LoginSerializer(data=request.data, context={"request": request})
        serializer.is_valid(raise_exception=True)
        return Response(serializer.get_token_pair(), status=status.HTTP_200_OK)


class TokenRefreshView(APIView):
    """POST /api/v1/auth/refresh/ — rotate a refresh token.

    The old refresh token is blacklisted (``BLACKLIST_AFTER_ROTATION``)
    on success. Errors surface through the standard envelope.
    """

    authentication_classes: list[Any] = []
    permission_classes = [AllowAny]

    @extend_schema(
        tags=["auth"],
        summary="Refresh JWT tokens",
        request=TokenRefreshInputSerializer,
        responses={200: None, 401: None},
    )
    def post(self, request: Request) -> Response:
        serializer = TokenRefreshInputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        raw_refresh = serializer.validated_data["refresh"]

        try:
            refresh = RefreshToken(raw_refresh)
            data: dict[str, Any] = {"access": str(refresh.access_token)}
            # ``ROTATE_REFRESH_TOKENS`` is True — mint & blacklist.
            try:
                refresh.blacklist()
            except AttributeError:  # pragma: no cover - blacklist app disabled
                pass
            new_refresh = RefreshToken.for_user(
                # ``for_user`` needs the user; look them up from the old
                # token's user_id claim.
                _resolve_user_from_token(refresh)
            )
            data["refresh"] = str(new_refresh)
        except TokenError as exc:
            raise InvalidToken(str(exc)) from exc

        return Response(data, status=status.HTTP_200_OK)


class MeView(APIView):
    """GET /api/v1/auth/me/ — return the authenticated user's profile."""

    permission_classes = [IsAuthenticated]

    @extend_schema(
        tags=["auth"],
        summary="Current user profile",
        responses={200: UserProfileSerializer, 401: None},
    )
    def get(self, request: Request) -> Response:
        serializer = UserProfileSerializer(request.user)
        return Response(serializer.data, status=status.HTTP_200_OK)


# ---------------------------------------------------------------------------
# Internal helpers
# ---------------------------------------------------------------------------
def _resolve_user_from_token(refresh: RefreshToken):
    """Look up the User referenced by ``refresh['user_id']``."""
    from django.contrib.auth import get_user_model  # local import — cheap

    user_model = get_user_model()
    user_id = refresh.get("user_id")
    if user_id is None:
        raise InvalidToken("Token has no user_id.")
    try:
        return user_model.objects.get(pk=user_id, is_active=True)
    except user_model.DoesNotExist as exc:
        raise InvalidToken("User not found for refresh token.") from exc
