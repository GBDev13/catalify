/*
  Warnings:

  - You are about to drop the column `logoId` on the `categories` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "categories" DROP CONSTRAINT "categories_logoId_fkey";

-- AlterTable
ALTER TABLE "categories" DROP COLUMN "logoId",
ADD COLUMN     "fileId" TEXT;

-- AlterTable
ALTER TABLE "companies" ADD COLUMN     "logoId" TEXT;

-- AddForeignKey
ALTER TABLE "companies" ADD CONSTRAINT "companies_logoId_fkey" FOREIGN KEY ("logoId") REFERENCES "File"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "categories" ADD CONSTRAINT "categories_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "File"("id") ON DELETE SET NULL ON UPDATE CASCADE;
