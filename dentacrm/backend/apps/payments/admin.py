"""Django admin registrations for the ``payments`` app."""
from __future__ import annotations

from django.contrib import admin

from .models import CommissionRecord, Payment


@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = (
        "id", "treatment", "patient", "amount", "method",
        "received_by", "is_active", "created_at",
    )
    list_filter = ("method", "is_active", "created_at")
    search_fields = ("patient__first_name", "patient__last_name", "note")
    autocomplete_fields = ("treatment", "patient", "received_by")
    readonly_fields = ("id", "created_at", "updated_at")
    ordering = ("-created_at",)


@admin.register(CommissionRecord)
class CommissionRecordAdmin(admin.ModelAdmin):
    list_display = (
        "id", "doctor", "treatment", "amount", "rate",
        "basis", "material_cost", "calculated_at",
    )
    list_filter = ("basis", "calculated_at")
    search_fields = ("doctor__user__last_name",)
    autocomplete_fields = ("doctor", "treatment")
    readonly_fields = (
        "id", "created_at", "updated_at", "calculated_at",
        "base_amount", "material_cost",
    )
    ordering = ("-calculated_at",)
