-- DropForeignKey
ALTER TABLE "stocks" DROP CONSTRAINT "stocks_productVariantOptionId_fkey";

-- AddForeignKey
ALTER TABLE "stocks" ADD CONSTRAINT "stocks_productVariantOptionId_fkey" FOREIGN KEY ("productVariantOptionId") REFERENCES "product_variant_options"("id") ON DELETE CASCADE ON UPDATE CASCADE;
