/*
  Warnings:

  - The values [Regular] on the enum `JobType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `monthToDate` on the `PaidOrders` table. All the data in the column will be lost.
  - You are about to drop the column `orderCount` on the `PaidOrders` table. All the data in the column will be lost.
  - Added the required column `lastMonthPaid` to the `PaidOrders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `monthToDateGenerated` to the `PaidOrders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `monthToDatePaid` to the `PaidOrders` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "JobType_new" AS ENUM ('MGT', 'OSP', 'REG');
ALTER TABLE "Employee" ALTER COLUMN "type" TYPE "JobType_new" USING ("type"::text::"JobType_new");
ALTER TYPE "JobType" RENAME TO "JobType_old";
ALTER TYPE "JobType_new" RENAME TO "JobType";
DROP TYPE "JobType_old";
COMMIT;

-- AlterTable
ALTER TABLE "PaidOrders" DROP COLUMN "monthToDate",
DROP COLUMN "orderCount",
ADD COLUMN     "lastMonthPaid" INTEGER NOT NULL,
ADD COLUMN     "monthToDateGenerated" INTEGER NOT NULL,
ADD COLUMN     "monthToDatePaid" INTEGER NOT NULL;
