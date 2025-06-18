-- AlterEnum
ALTER TYPE "JobType" ADD VALUE 'REG';

-- CreateTable
CREATE TABLE "PaidOrders" (
    "epi" TEXT NOT NULL,
    "orderCount" INTEGER NOT NULL,
    "monthToDate" INTEGER NOT NULL,

    CONSTRAINT "PaidOrders_pkey" PRIMARY KEY ("epi")
);

-- AddForeignKey
ALTER TABLE "PaidOrders" ADD CONSTRAINT "PaidOrders_epi_fkey" FOREIGN KEY ("epi") REFERENCES "Employee"("epi") ON DELETE CASCADE ON UPDATE CASCADE;
