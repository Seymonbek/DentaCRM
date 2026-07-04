-- PostgreSQL init script for DentaCRM.
-- Runs automatically inside the postgres:16 container on first startup
-- (files placed in /docker-entrypoint-initdb.d/ are executed once against
--  the database named by POSTGRES_DB after cluster init).
--
-- The btree_gist extension is required by the scheduling app so that
-- Appointment can define an ExclusionConstraint of the form
--     ExclusionConstraint(
--         expressions=[
--             ("doctor_id", "="),
--             (TstzRange("scheduled_start", "scheduled_end"), "&&"),
--         ],
--     )
-- which enforces "no double-booking per doctor" at the database level.
--
-- pg_trgm is enabled proactively for future ILIKE search acceleration
-- on Patient (name, phone_number) and is safe to have loaded.

CREATE EXTENSION IF NOT EXISTS btree_gist;
CREATE EXTENSION IF NOT EXISTS pg_trgm;
