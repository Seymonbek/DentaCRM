"""Django admin for the scheduling app."""
from __future__ import annotations

from django.contrib import admin
from simple_history.admin import SimpleHistoryAdmin

from .models import Appointment


@admin.register(Appointment)
class AppointmentAdmin(SimpleHistoryAdmin):
    list_display = (
        "scheduled_start",
        "scheduled_end",
        "patient",
        "doctor",
        "department",
        "status",
        "is_active",
    )
    list_filter = ("status", "department", "is_active")
    search_fields = (
        "patient__first_name",
        "patient__last_name",
        "patient__phone_number",
        "doctor__user__first_name",
        "doctor__user__last_name",
        "notes",
    )
    autocomplete_fields = (
        "patient",
        "doctor",
        "department",
        "procedure_type",
        "created_by",
    )
    date_hierarchy = "scheduled_start"
    readonly_fields = ("created_at", "updated_at")
    ordering = ("-scheduled_start",)
