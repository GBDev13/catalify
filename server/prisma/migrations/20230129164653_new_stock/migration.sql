-- AlterTable
ALTER TABLE "stocks" ADD COLUMN     "productVariantOption2Id" TEXT;

-- AddForeignKey
ALTER TABLE "stocks" ADD CONSTRAINT "stocks_productVariantOption2Id_fkey" FOREIGN KEY ("productVariantOption2Id") REFERENCES "product_variant_options"("id") ON DELETE CASCADE ON UPDATE CASCADE;
