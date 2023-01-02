/*
  Warnings:

  - Made the column `themeColor` on table `companies` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "companies" ALTER COLUMN "themeColor" SET NOT NULL;
