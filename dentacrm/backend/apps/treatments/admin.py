"""Django admin for the treatments app."""
from __future__ import annotations

from django.contrib import admin
from unfold.admin import ModelAdmin

from .models import Treatment, TreatmentPhoto


@admin.register(Treatment)
class TreatmentAdmin(ModelAdmin):
    list_display = (
        "id",
        "patient",
        "doctor",
        "department",
        "price",
        "payment_status",
        "stage",
        "is_active",
        "created_at",
    )
    list_filter = ("payment_status", "stage", "department", "is_active")
    search_fields = (
        "diagnosis",
        "description",
        "patient__first_name",
        "patient__last_name",
        "patient__phone_number",
    )
    autocomplete_fields = ("appointment", "doctor", "patient", "department")
    readonly_fields = ("created_at", "updated_at")
    ordering = ("-created_at",)


@admin.register(TreatmentPhoto)
class TreatmentPhotoAdmin(ModelAdmin):
    list_display = (
        "id",
        "treatment",
        "photo_type",
        "uploaded_at",
        "uploaded_by",
        "is_active",
    )
    list_filter = ("photo_type", "is_active")
    autocomplete_fields = ("treatment",)
    readonly_fields = ("uploaded_at", "created_at", "updated_at")
    ordering = ("-uploaded_at",)

