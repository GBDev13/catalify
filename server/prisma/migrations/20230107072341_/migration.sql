/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `companies` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "companies" ALTER COLUMN "slug" DROP DEFAULT;

-- CreateIndex
CREATE UNIQUE INDEX "companies_slug_key" ON "companies"("slug");
