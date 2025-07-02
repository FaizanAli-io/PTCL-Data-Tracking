-- AlterTable
ALTER TABLE "PaidOrders" ADD COLUMN     "monthToDateCompleted" INTEGER,
ALTER COLUMN "lastMonthPaid" DROP NOT NULL,
ALTER COLUMN "monthToDateGenerated" DROP NOT NULL,
ALTER COLUMN "monthToDatePaid" DROP NOT NULL;
