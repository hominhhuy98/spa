-- ============================================================
-- MIGRATION TẤT CẢ BẢNG CÒN THIẾU
-- Chạy trong Supabase Dashboard → SQL Editor → Run
-- Ngày: 07/04/2026
-- ============================================================

-- ── 1. Module Thuốc ─────────────────────────────────────────

CREATE TABLE IF NOT EXISTS prescriptions (
  id              BIGSERIAL PRIMARY KEY,
  appointment_id  BIGINT      NOT NULL REFERENCES appointments(id) ON DELETE CASCADE,
  prescribed_by   UUID        NOT NULL REFERENCES profiles(id),
  diagnosis       TEXT,
  notes           TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

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

-- ── 2. Module Điều Trị ──────────────────────────────────────

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

-- ── 3. RLS Policies ─────────────────────────────────────────

ALTER TABLE prescriptions      ENABLE ROW LEVEL SECURITY;
ALTER TABLE prescription_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE treatment_plans    ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'service_all' AND tablename = 'prescriptions') THEN
    CREATE POLICY "service_all" ON prescriptions FOR ALL USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'service_all' AND tablename = 'prescription_items') THEN
    CREATE POLICY "service_all" ON prescription_items FOR ALL USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'service_all' AND tablename = 'treatment_plans') THEN
    CREATE POLICY "service_all" ON treatment_plans FOR ALL USING (true) WITH CHECK (true);
  END IF;
END $$;

-- ── 4. Cột Zalo OAuth cho customers ────────────────────────

ALTER TABLE customers ADD COLUMN IF NOT EXISTS zalo_id TEXT UNIQUE;
ALTER TABLE customers ADD COLUMN IF NOT EXISTS full_name TEXT;

-- ── Done! ───────────────────────────────────────────────────
-- Sau khi chạy xong, quay lại Claude Code để tiếp tục.
