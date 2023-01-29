/*
  Warnings:

  - You are about to drop the column `productVariantOption2Id` on the `stocks` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "stocks" DROP CONSTRAINT "stocks_productVariantOption2Id_fkey";

-- AlterTable
ALTER TABLE "stocks" DROP COLUMN "productVariantOption2Id",
ADD COLUMN     "productVariantOptionId2" TEXT;

-- AddForeignKey
ALTER TABLE "stocks" ADD CONSTRAINT "stocks_productVariantOptionId2_fkey" FOREIGN KEY ("productVariantOptionId2") REFERENCES "product_variant_options"("id") ON DELETE CASCADE ON UPDATE CASCADE;
