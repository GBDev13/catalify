/*
  Warnings:

  - You are about to drop the column `userId` on the `subscriptions` table. All the data in the column will be lost.
  - You are about to drop the column `customerId` on the `users` table. All the data in the column will be lost.
  - Added the required column `companyId` to the `subscriptions` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "subscriptions" DROP CONSTRAINT "subscriptions_userId_fkey";

-- AlterTable
ALTER TABLE "companies" ADD COLUMN     "customerId" TEXT;

-- AlterTable
ALTER TABLE "subscriptions" DROP COLUMN "userId",
ADD COLUMN     "companyId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "customerId";

-- AddForeignKey
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;
