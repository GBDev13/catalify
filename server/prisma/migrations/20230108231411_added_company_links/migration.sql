-- CreateTable
CREATE TABLE "company_links" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "companyId" TEXT NOT NULL,

    CONSTRAINT "company_links_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "company_links" ADD CONSTRAINT "company_links_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;
