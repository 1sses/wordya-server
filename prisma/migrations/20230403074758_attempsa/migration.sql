/*
  Warnings:

  - The `attempts` column on the `FiveInARow` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "FiveInARow" DROP COLUMN "attempts",
ADD COLUMN     "attempts" TEXT[];
