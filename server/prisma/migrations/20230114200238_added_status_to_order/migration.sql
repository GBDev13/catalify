-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'FINISHED', 'EXPIRED');

-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "status" "OrderStatus" NOT NULL DEFAULT 'PENDING';
