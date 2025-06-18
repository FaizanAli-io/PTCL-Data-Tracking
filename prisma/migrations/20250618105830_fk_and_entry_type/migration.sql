-- CreateEnum
CREATE TYPE "EntryType" AS ENUM ('DDS', 'Float', 'Kiosk');

-- AlterTable
ALTER TABLE "FSA" ADD COLUMN     "type" "EntryType" NOT NULL DEFAULT 'DDS';

-- AddForeignKey
ALTER TABLE "FSA" ADD CONSTRAINT "FSA_epi_fkey" FOREIGN KEY ("epi") REFERENCES "Employee"("epi") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TSA" ADD CONSTRAINT "TSA_epi_fkey" FOREIGN KEY ("epi") REFERENCES "Employee"("epi") ON DELETE CASCADE ON UPDATE CASCADE;
