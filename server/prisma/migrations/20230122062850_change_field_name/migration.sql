/*
  Warnings:

  - You are about to drop the column `fileId` on the `company_links_pages` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "company_links_pages" DROP CONSTRAINT "company_links_pages_fileId_fkey";

-- AlterTable
ALTER TABLE "company_links_pages" DROP COLUMN "fileId",
ADD COLUMN     "logoId" TEXT;

-- AddForeignKey
ALTER TABLE "company_links_pages" ADD CONSTRAINT "company_links_pages_logoId_fkey" FOREIGN KEY ("logoId") REFERENCES "File"("id") ON DELETE SET NULL ON UPDATE CASCADE;
