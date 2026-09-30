-- Additive flag: false keeps the committed gallery as the legacy baseline.
-- The manager portal sets it to true when a manager intentionally saves a
-- complete gallery, making that exact order authoritative on the public site.
ALTER TABLE "Property"
ADD COLUMN IF NOT EXISTS "galleryManaged" BOOLEAN NOT NULL DEFAULT false;
