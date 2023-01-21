/*
  Warnings:

  - The values [PENDING] on the enum `SubscriptionStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `currentPeriodEnd` on the `subscriptions` table. All the data in the column will be lost.
  - You are about to drop the column `currentPeriodStart` on the `subscriptions` table. All the data in the column will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "SubscriptionStatus_new" AS ENUM ('ACTIVE', 'CANCELED', 'CANCELING', 'EXPIRED');
ALTER TABLE "subscriptions" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "subscriptions" ALTER COLUMN "status" TYPE "SubscriptionStatus_new" USING ("status"::text::"SubscriptionStatus_new");
ALTER TYPE "SubscriptionStatus" RENAME TO "SubscriptionStatus_old";
ALTER TYPE "SubscriptionStatus_new" RENAME TO "SubscriptionStatus";
DROP TYPE "SubscriptionStatus_old";
ALTER TABLE "subscriptions" ALTER COLUMN "status" SET DEFAULT 'ACTIVE';
COMMIT;

-- AlterTable
ALTER TABLE "subscriptions" DROP COLUMN "currentPeriodEnd",
DROP COLUMN "currentPeriodStart";
