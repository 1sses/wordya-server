-- AlterTable
ALTER TABLE "FiveInARow" ALTER COLUMN "status" SET DEFAULT 'IN_PROGRESS',
ALTER COLUMN "attempts" SET DEFAULT ARRAY[]::TEXT[];