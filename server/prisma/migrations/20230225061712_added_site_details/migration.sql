-- AlterTable
ALTER TABLE "companies" ADD COLUMN     "siteDetailId" TEXT;

-- CreateTable
CREATE TABLE "site_details" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "faviconFileId" TEXT,
    "withFloatingButton" BOOLEAN NOT NULL DEFAULT true,
    "imageFitMode" TEXT NOT NULL DEFAULT 'cover',

    CONSTRAINT "site_details_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "companies" ADD CONSTRAINT "companies_siteDetailId_fkey" FOREIGN KEY ("siteDetailId") REFERENCES "site_details"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "site_details" ADD CONSTRAINT "site_details_faviconFileId_fkey" FOREIGN KEY ("faviconFileId") REFERENCES "File"("id") ON DELETE SET NULL ON UPDATE CASCADE;
