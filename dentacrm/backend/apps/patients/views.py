"""HTTP orchestration for the ``patients`` app.

Views are intentionally thin: they wire DRF viewsets to selectors,
services, serializers, and the permission class. Actual business logic
lives in :mod:`apps.patients.services` and query construction lives in
:mod:`apps.patients.selectors`.

Endpoints (PROJECT_BRIEF § "Patients"):

* ``GET  /api/v1/patients/``            — paginated list, ``?search=`` filter.
* ``POST /api/v1/patients/``            — create (bosh_shifokor / administrator).
* ``GET  /api/v1/patients/{id}/``       — retrieve.
* ``PATCH /api/v1/patients/{id}/``      — partial update.
* ``PUT   /api/v1/patients/{id}/``      — full update.
* ``DELETE /api/v1/patients/{id}/``     — soft-delete.
* ``GET  /api/v1/patients/{id}/history/``    — treatment timeline (aggregated).
* ``GET  /api/v1/patients/{id}/odontogram/`` — tooth-formula snapshot.
"""
from __future__ import annotations

from typing import Any

from django_filters.rest_framework import DjangoFilterBackend
from drf_spectacular.utils import OpenApiParameter, extend_schema
from rest_framework import filters, status, viewsets
from rest_framework.decorators import action
from rest_framework.request import Request
from rest_framework.response import Response

from .models import Patient
from .permissions import PatientPermission
from .selectors import (
    active_patients,
    all_patients,
    search_patients,
)
from .serializers import (
    PatientHistoryEventSerializer,
    PatientOdontogramToothSerializer,
    PatientSerializer,
)
from .services import soft_delete_patient

# FDI numbering used by the frontend odontogram — permanent adult teeth
# only. Deciduous (51-85) are out of scope per PROJECT_BRIEF.
_FDI_TEETH: tuple[int, ...] = tuple(
    n
    for quadrant in (10, 20, 30, 40)
    for n in range(quadrant + 1, quadrant + 9)
)  # → (11..18, 21..28, 31..38, 41..48) = 32 teeth


@extend_schema(tags=["patients"])
class PatientViewSet(viewsets.ModelViewSet):
    """CRUD for :class:`Patient` under ``/api/v1/patients/``."""

    serializer_class = PatientSerializer
    permission_classes = [PatientPermission]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ["is_active", "gender"]
    ordering_fields = ["last_name", "first_name", "created_at"]
    ordering = ["last_name", "first_name"]
    lookup_field = "pk"

    # Sub-resource views (history / odontogram) can be read by any
    # authenticated user.
    def get_queryset(self):
        request: Request | None = getattr(self, "request", None)
        if request is None:
            return active_patients()

        include_inactive = str(
            request.query_params.get("include_inactive", "")
        ).lower() in {"1", "true", "yes"}
        role = getattr(request.user, "role", None)

        base = (
            all_patients()
            if (include_inactive and role == "bosh_shifokor")
            else active_patients()
        )

        query = request.query_params.get("search")
        if query:
            return search_patients(
                query,
                include_inactive=(
                    include_inactive and role == "bosh_shifokor"
                ),
            )
        return base.order_by("last_name", "first_name")

    # ------------------------------------------------------------------
    # Schema tweaks
    # ------------------------------------------------------------------
    @extend_schema(
        parameters=[
            OpenApiParameter(
                name="search",
                required=False,
                type=str,
                location=OpenApiParameter.QUERY,
                description="Case-insensitive substring match on name or phone.",
            ),
            OpenApiParameter(
                name="include_inactive",
                required=False,
                type=bool,
                location=OpenApiParameter.QUERY,
                description="Include soft-deleted patients (bosh_shifokor only).",
            ),
        ],
    )
    def list(self, request: Request, *args: Any, **kwargs: Any) -> Response:
        return super().list(request, *args, **kwargs)

    # ------------------------------------------------------------------
    # Soft-delete instead of hard delete
    # ------------------------------------------------------------------
    def destroy(self, request: Request, *args: Any, **kwargs: Any) -> Response:
        patient: Patient = self.get_object()
        soft_delete_patient(patient)
        return Response(status=status.HTTP_204_NO_CONTENT)

    # ------------------------------------------------------------------
    # /patients/{id}/history/
    # ------------------------------------------------------------------
    @extend_schema(
        summary="Patient treatment timeline",
        responses={200: PatientHistoryEventSerializer(many=True)},
    )
    @action(detail=True, methods=["get"], url_path="history")
    def history(self, request: Request, pk: str | None = None) -> Response:
        """Aggregated treatment/appointment/payment timeline.

        The concrete data sources (treatments, appointments, payments)
        come online in later phases. Until then the timeline is empty
        but the endpoint returns the standard shape so the frontend can
        wire ``usePatientHistory`` today.
        """
        patient: Patient = self.get_object()
        events: list[dict[str, Any]] = _collect_history_events(patient)
        # Fall back to the "patient registered" note so an empty timeline
        # still shows *something* useful in the UI.
        if not events:
            events = [
                {
                    "id": f"patient-created-{patient.id}",
                    "type": "note",
                    "occurredAt": patient.created_at,
                    "title": "Bemor ro'yxatga olindi",
                    "summary": (
                        f"Kartochka yaratildi: {patient.full_name}, "
                        f"{patient.phone_number}."
                    ),
                    "meta": {},
                }
            ]
        serializer = PatientHistoryEventSerializer(events, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    # ------------------------------------------------------------------
    # /patients/{id}/odontogram/
    # ------------------------------------------------------------------
    @extend_schema(
        summary="Patient odontogram snapshot",
        responses={200: PatientOdontogramToothSerializer(many=True)},
    )
    @action(detail=True, methods=["get"], url_path="odontogram")
    def odontogram(self, request: Request, pk: str | None = None) -> Response:
        """Return one entry per FDI tooth with the most-recent status.

        Prior to T13 (odontogram app) every tooth is reported as
        ``healthy`` — the endpoint still returns the full 32-tooth
        payload so the SVG component renders correctly.
        """
        patient: Patient = self.get_object()
        teeth = _collect_odontogram(patient)
        serializer = PatientOdontogramToothSerializer(teeth, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


# ---------------------------------------------------------------------------
# Aggregators — kept as private helpers so subsequent tasks (T10/T12/T13)
# can extend them without touching the view class.
# ---------------------------------------------------------------------------
def _collect_history_events(patient: Patient) -> list[dict[str, Any]]:
    """Aggregate timeline events across all installed apps.

    Uses ``apps.get_app_config()`` to avoid import cycles: if the
    treatments / appointments apps are not yet installed we simply
    skip them. This keeps the endpoint compilable across all phases.
    """
    from django.apps import apps as django_apps  # local import for testability

    events: list[dict[str, Any]] = []

    # Appointments — added in T10.
    if django_apps.is_installed("apps.scheduling"):
        try:
            Appointment = django_apps.get_model("scheduling", "Appointment")  # noqa: N806
        except LookupError:
            Appointment = None  # noqa: N806
        if Appointment is not None:
            for appt in Appointment.objects.filter(patient=patient).order_by(
                "-scheduled_start"
            )[:50]:
                events.append(
                    {
                        "id": f"appointment-{appt.pk}",
                        "type": "appointment",
                        "occurredAt": appt.scheduled_start,
                        "title": f"Navbat ({appt.get_status_display()})",
                        "summary": "",
                        "meta": {"appointmentId": str(appt.pk)},
                    }
                )

    # Treatments — added in T12.
    if django_apps.is_installed("apps.treatments"):
        try:
            Treatment = django_apps.get_model("treatments", "Treatment")  # noqa: N806
        except LookupError:
            Treatment = None  # noqa: N806
        if Treatment is not None:
            for tr in Treatment.objects.filter(patient=patient).order_by(
                "-created_at"
            )[:50]:
                events.append(
                    {
                        "id": f"treatment-{tr.pk}",
                        "type": "treatment",
                        "occurredAt": tr.created_at,
                        "title": getattr(tr, "diagnosis", "") or "Davolash",
                        "summary": getattr(tr, "description", "") or "",
                        "meta": {"treatmentId": str(tr.pk)},
                    }
                )

    # Payments — added in T17.
    if django_apps.is_installed("apps.payments"):
        try:
            Payment = django_apps.get_model("payments", "Payment")  # noqa: N806
        except LookupError:
            Payment = None  # noqa: N806
        if Payment is not None:
            for pay in Payment.objects.filter(patient=patient).order_by(
                "-created_at"
            )[:50]:
                events.append(
                    {
                        "id": f"payment-{pay.pk}",
                        "type": "payment",
                        "occurredAt": pay.created_at,
                        "title": f"To'lov — {pay.amount}",
                        "summary": "",
                        "meta": {
                            "paymentId": str(pay.pk),
                            "amount": str(pay.amount),
                        },
                    }
                )

    events.sort(key=lambda e: e["occurredAt"], reverse=True)
    return events


def _collect_odontogram(patient: Patient) -> list[dict[str, Any]]:
    """Build a 32-tooth snapshot; overlay tooth records if available."""
    from django.apps import apps as django_apps  # local import

    # Default arch — every tooth healthy.
    snapshot: dict[int, dict[str, Any]] = {
        n: {
            "toothNumber": n,
            "status": "healthy",
            "procedure": None,
            "notes": "",
        }
        for n in _FDI_TEETH
    }

    # Overlay real records from the odontogram app once T13 lands.
    if django_apps.is_installed("apps.odontogram"):
        try:
            ToothRecord = django_apps.get_model("odontogram", "ToothRecord")  # noqa: N806
        except LookupError:
            ToothRecord = None  # noqa: N806
        if ToothRecord is not None:
            records = (
                ToothRecord.objects.filter(treatment__patient=patient)
                .order_by("tooth_number", "-treatment__created_at")
            )
            seen: set[int] = set()
            for rec in records:
                tooth = getattr(rec, "tooth_number", None)
                if tooth in seen or tooth not in snapshot:
                    continue
                seen.add(tooth)
                snapshot[tooth] = {
                    "toothNumber": tooth,
                    "status": getattr(rec, "status", "healthy") or "healthy",
                    "procedure": getattr(rec, "procedure", None),
                    "notes": getattr(rec, "notes", "") or "",
                }
    return [snapshot[n] for n in _FDI_TEETH]


__all__ = ["PatientViewSet"]
