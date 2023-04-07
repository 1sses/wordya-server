/*
  Warnings:

  - Added the required column `difficulty` to the `FiveInARow` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "FiveInARow" ADD COLUMN     "difficulty" INTEGER NOT NULL;
