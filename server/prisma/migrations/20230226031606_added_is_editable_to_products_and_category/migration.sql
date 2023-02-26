-- AlterTable
ALTER TABLE "categories" ADD COLUMN     "isEditable" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "products" ADD COLUMN     "isEditable" BOOLEAN NOT NULL DEFAULT true;
