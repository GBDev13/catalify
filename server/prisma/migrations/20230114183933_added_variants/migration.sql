-- AlterTable
ALTER TABLE "order_products" ADD COLUMN     "productVariantId" TEXT,
ADD COLUMN     "productVariantOptionId" TEXT;

-- AddForeignKey
ALTER TABLE "order_products" ADD CONSTRAINT "order_products_productVariantId_fkey" FOREIGN KEY ("productVariantId") REFERENCES "product_variants"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_products" ADD CONSTRAINT "order_products_productVariantOptionId_fkey" FOREIGN KEY ("productVariantOptionId") REFERENCES "product_variant_options"("id") ON DELETE SET NULL ON UPDATE CASCADE;
