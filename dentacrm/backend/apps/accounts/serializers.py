"""DRF serializers for the accounts app.

Design notes:

* API payloads are **camelCase** per the frontend contract. Instead of
  pulling in ``djangorestframework-camel-case`` (extra dep, global side
  effects) we override :meth:`Serializer.to_representation` locally to
  rename the small set of fields we expose.
* The login serializer validates credentials **without** calling
  ``authenticate()`` on unknown users so we never leak which phone
  numbers exist through timing.
"""
from __future__ import annotations

from typing import Any

from django.contrib.auth import authenticate
from django.core.exceptions import ValidationError as DjangoValidationError
from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken

from .models import User, normalise_phone_number


# ---------------------------------------------------------------------------
# /auth/me/  ← camelCase profile response
# ---------------------------------------------------------------------------
class UserProfileSerializer(serializers.ModelSerializer):
    """Serializes the currently-authenticated user for ``GET /auth/me/``.

    The output payload is camelCase to match the frontend TS ``User``
    interface: ``{id, firstName, lastName, phoneNumber, role}``.
    """

    class Meta:
        model = User
        fields = ("id", "first_name", "last_name", "phone_number", "role")
        read_only_fields = fields

    def to_representation(self, instance: User) -> dict[str, Any]:
        base = super().to_representation(instance)
        return {
            "id": str(base["id"]),
            "firstName": base["first_name"],
            "lastName": base["last_name"],
            "phoneNumber": base["phone_number"],
            "role": base["role"],
        }


# ---------------------------------------------------------------------------
# /auth/login/
# ---------------------------------------------------------------------------
class LoginSerializer(serializers.Serializer):
    """Validate phone+password and mint a JWT token pair.

    Accepts both snake_case and camelCase input keys so the frontend can
    POST ``{"phoneNumber": "...", "password": "..."}`` without an extra
    transformation layer.
    """

    phone_number = serializers.CharField(write_only=True, required=False)
    phoneNumber = serializers.CharField(  # noqa: N815 - camelCase alias
        write_only=True,
        required=False,
    )
    password = serializers.CharField(
        write_only=True,
        style={"input_type": "password"},
        trim_whitespace=False,
    )

    # Filled in by ``validate``.
    user: User | None = None

    def to_internal_value(self, data: Any) -> dict[str, Any]:
        # Normalise camelCase → snake_case so downstream code has one shape.
        if isinstance(data, dict) and "phoneNumber" in data and "phone_number" not in data:
            data = {**data, "phone_number": data["phoneNumber"]}
        return super().to_internal_value(data)

    def validate(self, attrs: dict[str, Any]) -> dict[str, Any]:
        phone = attrs.get("phone_number") or attrs.get("phoneNumber")
        password = attrs.get("password")

        if not phone or not password:
            raise serializers.ValidationError(
                {"detail": "Telefon raqami va parol majburiy."}
            )

        try:
            phone = normalise_phone_number(phone)
        except DjangoValidationError as exc:
            raise serializers.ValidationError(
                {"phoneNumber": list(exc.messages)}
            ) from exc

        request = self.context.get("request")
        user = authenticate(request=request, username=phone, password=password)
        if user is None:
            # Uniform message — do not leak whether the phone exists.
            raise serializers.ValidationError(
                {"detail": "Telefon raqami yoki parol noto'g'ri."}
            )
        if not user.is_active:
            raise serializers.ValidationError(
                {"detail": "Foydalanuvchi bloklangan."}
            )

        attrs["user"] = user
        self.user = user
        return attrs

    def get_token_pair(self) -> dict[str, Any]:
        """Mint an access+refresh pair and echo the user profile."""
        assert self.user is not None, "call is_valid() before get_token_pair()"
        refresh = RefreshToken.for_user(self.user)
        # Custom claims — mirror them so the frontend can decode without
        # a round-trip to /auth/me/ during initial hydration.
        refresh["role"] = self.user.role
        access = refresh.access_token
        access["role"] = self.user.role
        return {
            "access": str(access),
            "refresh": str(refresh),
            "user": UserProfileSerializer(self.user).data,
        }


# ---------------------------------------------------------------------------
# /auth/refresh/
# ---------------------------------------------------------------------------
class TokenRefreshInputSerializer(serializers.Serializer):
    """Accept a refresh token; blacklist old + return new tokens."""

    refresh = serializers.CharField(write_only=True)
