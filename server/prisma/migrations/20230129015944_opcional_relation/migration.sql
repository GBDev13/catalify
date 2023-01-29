-- DropForeignKey
ALTER TABLE "stocks" DROP CONSTRAINT "stocks_productVariantOptionId_fkey";

-- AlterTable
ALTER TABLE "stocks" ALTER COLUMN "productVariantOptionId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "stocks" ADD CONSTRAINT "stocks_productVariantOptionId_fkey" FOREIGN KEY ("productVariantOptionId") REFERENCES "product_variant_options"("id") ON DELETE SET NULL ON UPDATE CASCADE;
