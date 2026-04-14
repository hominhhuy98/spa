-- ============================================================
-- Migration: Module Thuốc & Module Điều Trị
-- Chạy file này trong Supabase Dashboard → SQL Editor
-- ============================================================

-- 1. Đơn thuốc
CREATE TABLE IF NOT EXISTS prescriptions (
  id              BIGSERIAL PRIMARY KEY,
  appointment_id  BIGINT      NOT NULL REFERENCES appointments(id) ON DELETE CASCADE,
  prescribed_by   UUID        NOT NULL REFERENCES profiles(id),
  diagnosis       TEXT,
  notes           TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Các dòng thuốc trong đơn
CREATE TABLE IF NOT EXISTS prescription_items (
  id                BIGSERIAL PRIMARY KEY,
  prescription_id   BIGINT NOT NULL REFERENCES prescriptions(id) ON DELETE CASCADE,
  medicine_name     TEXT   NOT NULL,
  dosage            TEXT,
  frequency         TEXT,
  duration          TEXT,
  instructions      TEXT,
  sort_order        INT    NOT NULL DEFAULT 0
);

-- 3. Phác đồ điều trị
CREATE TABLE IF NOT EXISTS treatment_plans (
  id                  BIGSERIAL PRIMARY KEY,
  appointment_id      BIGINT      NOT NULL REFERENCES appointments(id) ON DELETE CASCADE,
  prescribed_by       UUID        NOT NULL REFERENCES profiles(id),
  diagnosis           TEXT,
  plan_detail         TEXT,
  sessions_total      INT         NOT NULL DEFAULT 1,
  sessions_done       INT         NOT NULL DEFAULT 0,
  next_session_date   DATE,
  notes               TEXT,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- RLS: cho phép service role (backend) đọc ghi tự do
ALTER TABLE prescriptions      ENABLE ROW LEVEL SECURITY;
ALTER TABLE prescription_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE treatment_plans    ENABLE ROW LEVEL SECURITY;

CREATE POLICY "service_all" ON prescriptions      FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "service_all" ON prescription_items FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "service_all" ON treatment_plans    FOR ALL USING (true) WITH CHECK (true);
