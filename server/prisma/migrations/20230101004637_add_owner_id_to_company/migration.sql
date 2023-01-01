/*
  Warnings:

  - Added the required column `ownerId` to the `companies` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "companies" ADD COLUMN     "ownerId" TEXT NOT NULL;
