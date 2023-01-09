-- CreateTable
CREATE TABLE "company_banners" (
    "id" TEXT NOT NULL,
    "url" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "pictureId" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,

    CONSTRAINT "company_banners_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "company_banners" ADD CONSTRAINT "company_banners_pictureId_fkey" FOREIGN KEY ("pictureId") REFERENCES "File"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "company_banners" ADD CONSTRAINT "company_banners_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;
