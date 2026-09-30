-- Additive setup for existing production databases; no existing data is changed.
CREATE TABLE IF NOT EXISTS "ReportSettings" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "recipient" TEXT NOT NULL,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
