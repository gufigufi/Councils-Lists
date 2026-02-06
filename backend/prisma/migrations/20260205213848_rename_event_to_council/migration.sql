-- AlterTable: Rename Event table to councils
ALTER TABLE "Event" RENAME TO "councils";

-- CreateIndex (if not exists)
CREATE INDEX IF NOT EXISTS "councils_latitude_longitude_idx" ON "councils"("latitude", "longitude");
