-- DropForeignKey
ALTER TABLE "company_links_pages_links" DROP CONSTRAINT "company_links_pages_links_companyLinksPageId_fkey";

-- AddForeignKey
ALTER TABLE "company_links_pages_links" ADD CONSTRAINT "company_links_pages_links_companyLinksPageId_fkey" FOREIGN KEY ("companyLinksPageId") REFERENCES "company_links_pages"("id") ON DELETE CASCADE ON UPDATE CASCADE;
