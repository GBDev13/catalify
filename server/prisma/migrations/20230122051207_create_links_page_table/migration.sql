-- CreateTable
CREATE TABLE "company_links_pages" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "headLine" TEXT,
    "textColor" VARCHAR(7) NOT NULL,
    "textColor2" VARCHAR(7) NOT NULL,
    "boxColor" VARCHAR(7) NOT NULL,
    "boxMode" TEXT NOT NULL,
    "bgColor" VARCHAR(7) NOT NULL,
    "bgColor2" VARCHAR(7) NOT NULL,
    "bgMode" TEXT NOT NULL,
    "logoMode" TEXT NOT NULL,
    "fileId" TEXT,
    "companyId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "company_links_pages_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "company_links_pages" ADD CONSTRAINT "company_links_pages_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "File"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "company_links_pages" ADD CONSTRAINT "company_links_pages_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;
