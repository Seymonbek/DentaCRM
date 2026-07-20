import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.local')
django.setup()

from apps.accounts.models import User
from apps.doctors.models import DoctorProfile

users = User.objects.all()
with open('db_check.txt', 'w') as f:
    f.write("=== USERS ===\n")
    for u in users:
        has_dp = DoctorProfile.objects.filter(user=u).exists()
        dp_active = DoctorProfile.objects.filter(user=u).first().is_active if has_dp else None
        f.write(f"Phone: {u.phone_number}, Role: {u.role}, Active: {u.is_active}, Has DoctorProfile: {has_dp}, DP Active: {dp_active}\n")
    
    f.write("\n=== DOCTOR PROFILES ===\n")
    for dp in DoctorProfile.objects.all():
        f.write(f"ID: {dp.id}, User Phone: {dp.user.phone_number}, Active: {dp.is_active}, Name: {dp.user.first_name} {dp.user.last_name}\n")
