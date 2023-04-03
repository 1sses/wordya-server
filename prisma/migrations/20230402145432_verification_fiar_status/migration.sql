/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `EmailActivation` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterEnum
ALTER TYPE "FiveInARowStatus" ADD VALUE 'IN_PROGRESS';

-- CreateIndex
CREATE UNIQUE INDEX "EmailActivation_userId_key" ON "EmailActivation"("userId");
