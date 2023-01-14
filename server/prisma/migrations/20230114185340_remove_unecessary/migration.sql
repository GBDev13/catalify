/*
  Warnings:

  - You are about to drop the column `productVariantId` on the `order_products` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "order_products" DROP CONSTRAINT "order_products_productVariantId_fkey";

-- AlterTable
ALTER TABLE "order_products" DROP COLUMN "productVariantId";
