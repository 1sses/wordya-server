/*
  Warnings:

  - Added the required column `attempts` to the `FiveInARow` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- AlterTable
ALTER TABLE "FiveInARow" ADD COLUMN     "attempts" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "status" "UserStatus" NOT NULL DEFAULT 'INACTIVE';
