/*
  Warnings:

  - You are about to drop the column `cancelAt` on the `subscriptions` table. All the data in the column will be lost.
  - You are about to drop the column `endDate` on the `subscriptions` table. All the data in the column will be lost.
  - You are about to drop the column `plan` on the `subscriptions` table. All the data in the column will be lost.
  - You are about to drop the column `startDate` on the `subscriptions` table. All the data in the column will be lost.
  - The `status` column on the `subscriptions` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "SubscriptionStatus" AS ENUM ('ACTIVE', 'CANCELED', 'EXPIRED');

-- AlterTable
ALTER TABLE "subscriptions" DROP COLUMN "cancelAt",
DROP COLUMN "endDate",
DROP COLUMN "plan",
DROP COLUMN "startDate",
DROP COLUMN "status",
ADD COLUMN     "status" "SubscriptionStatus" NOT NULL DEFAULT 'ACTIVE';
