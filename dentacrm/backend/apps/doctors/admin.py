"""Django admin for the ``doctors`` app."""
from __future__ import annotations

from django.contrib import admin
from simple_history.admin import SimpleHistoryAdmin

from .models import DoctorProfile, ProcedureType, TimeOff, WorkingHours


class WorkingHoursInline(admin.TabularInline):
    model = WorkingHours
    extra = 0
    fields = ("weekday", "start_time", "end_time")


class TimeOffInline(admin.TabularInline):
    model = TimeOff
    extra = 0
    fields = ("date_start", "date_end", "reason")


@admin.register(DoctorProfile)
class DoctorProfileAdmin(SimpleHistoryAdmin):
    list_display = (
        "user",
        "specialization",
        "commission_basis",
        "default_commission_rate",
        "is_active",
    )
    list_filter = ("commission_basis", "is_active")
    search_fields = (
        "user__first_name",
        "user__last_name",
        "user__phone_number",
        "specialization",
    )
    autocomplete_fields = ("user", "departments")
    filter_horizontal = ("departments",)
    readonly_fields = ("created_at", "updated_at")
    inlines = (WorkingHoursInline, TimeOffInline)


@admin.register(WorkingHours)
class WorkingHoursAdmin(admin.ModelAdmin):
    list_display = ("doctor", "weekday", "start_time", "end_time")
    list_filter = ("weekday",)
    search_fields = ("doctor__user__first_name", "doctor__user__last_name")


@admin.register(TimeOff)
class TimeOffAdmin(admin.ModelAdmin):
    list_display = ("doctor", "date_start", "date_end", "reason")
    list_filter = ("date_start",)
    search_fields = ("doctor__user__first_name", "doctor__user__last_name", "reason")


@admin.register(ProcedureType)
class ProcedureTypeAdmin(SimpleHistoryAdmin):
    list_display = (
        "name",
        "department",
        "default_duration_minutes",
        "default_price",
        "is_active",
    )
    list_filter = ("department", "is_active")
    search_fields = ("name", "department__name")
    autocomplete_fields = ("department",)
