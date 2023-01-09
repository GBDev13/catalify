-- DropForeignKey
ALTER TABLE "company_banners" DROP CONSTRAINT "company_banners_pictureId_fkey";

-- AddForeignKey
ALTER TABLE "company_banners" ADD CONSTRAINT "company_banners_pictureId_fkey" FOREIGN KEY ("pictureId") REFERENCES "File"("id") ON DELETE CASCADE ON UPDATE CASCADE;
