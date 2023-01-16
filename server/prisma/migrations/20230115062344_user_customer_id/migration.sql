/*
  Warnings:

  - You are about to drop the column `checkoutUserId` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "checkoutUserId",
ADD COLUMN     "customerId" TEXT;
