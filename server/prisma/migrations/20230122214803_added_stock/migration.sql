-- CreateTable
CREATE TABLE "stocks" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "productId" TEXT NOT NULL,
    "productVariantOptionId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,

    CONSTRAINT "stocks_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "stocks" ADD CONSTRAINT "stocks_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stocks" ADD CONSTRAINT "stocks_productVariantOptionId_fkey" FOREIGN KEY ("productVariantOptionId") REFERENCES "product_variant_options"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
