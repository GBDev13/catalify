-- AlterTable
ALTER TABLE "categories" ADD COLUMN     "logoId" TEXT;

-- AddForeignKey
ALTER TABLE "categories" ADD CONSTRAINT "categories_logoId_fkey" FOREIGN KEY ("logoId") REFERENCES "File"("id") ON DELETE SET NULL ON UPDATE CASCADE;
