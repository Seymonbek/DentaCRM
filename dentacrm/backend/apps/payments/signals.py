"""Signal handlers for the ``payments`` app.

Keeps :attr:`Treatment.payment_status` and the doctor's
:class:`CommissionRecord` in sync with active payments.

* ``post_save`` on :class:`Payment` → refresh payment status; if the
  treatment is fully paid, recompute the commission.
* ``post_delete`` on :class:`Payment` → refresh payment status
  (defensive — the app soft-voids instead of hard-deleting, but tests
  and admin actions may still remove rows).
"""
from __future__ import annotations

import logging

from django.db.models.signals import post_delete, post_save
from django.dispatch import receiver

from .models import Payment
from .services import _refresh_payment_status

logger = logging.getLogger(__name__)


@receiver(post_save, sender=Payment, dispatch_uid="payments.payment.refresh_on_save")
def _on_payment_saved(sender, instance: Payment, created: bool, **kwargs):
    try:
        _refresh_payment_status(instance.treatment)
    except Exception:  # noqa: BLE001
        logger.exception(
            "payments: refresh after payment save failed for treatment %s",
            instance.treatment_id,
        )


@receiver(post_delete, sender=Payment, dispatch_uid="payments.payment.refresh_on_delete")
def _on_payment_deleted(sender, instance: Payment, **kwargs):
    treatment = getattr(instance, "treatment", None)
    if treatment is None:
        return
    try:
        _refresh_payment_status(treatment)
    except Exception:  # noqa: BLE001
        logger.exception(
            "payments: refresh after payment delete failed for treatment %s",
            instance.treatment_id,
        )


__all__ = ["_on_payment_saved", "_on_payment_deleted"]
