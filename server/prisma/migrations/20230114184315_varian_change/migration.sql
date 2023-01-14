/*
  Warnings:

  - You are about to drop the column `productVariantOptionId` on the `order_products` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "order_products" DROP CONSTRAINT "order_products_productVariantOptionId_fkey";

-- AlterTable
ALTER TABLE "order_products" DROP COLUMN "productVariantOptionId";

-- CreateTable
CREATE TABLE "_OrderProductsToProductVariantOption" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_OrderProductsToProductVariantOption_AB_unique" ON "_OrderProductsToProductVariantOption"("A", "B");

-- CreateIndex
CREATE INDEX "_OrderProductsToProductVariantOption_B_index" ON "_OrderProductsToProductVariantOption"("B");

-- AddForeignKey
ALTER TABLE "_OrderProductsToProductVariantOption" ADD CONSTRAINT "_OrderProductsToProductVariantOption_A_fkey" FOREIGN KEY ("A") REFERENCES "order_products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OrderProductsToProductVariantOption" ADD CONSTRAINT "_OrderProductsToProductVariantOption_B_fkey" FOREIGN KEY ("B") REFERENCES "product_variant_options"("id") ON DELETE CASCADE ON UPDATE CASCADE;
