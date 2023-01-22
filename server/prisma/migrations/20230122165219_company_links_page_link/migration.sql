-- CreateTable
CREATE TABLE "company_links_pages_links" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "companyLinksPageId" TEXT NOT NULL,

    CONSTRAINT "company_links_pages_links_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "company_links_pages_links" ADD CONSTRAINT "company_links_pages_links_companyLinksPageId_fkey" FOREIGN KEY ("companyLinksPageId") REFERENCES "company_links_pages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
