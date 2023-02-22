/*
  Warnings:

  - You are about to drop the column `choosedPlanAt` on the `users` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "tokens" DROP CONSTRAINT "tokens_userId_fkey";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "choosedPlanAt";

-- AddForeignKey
ALTER TABLE "tokens" ADD CONSTRAINT "tokens_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
