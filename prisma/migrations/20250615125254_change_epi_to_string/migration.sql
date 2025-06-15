/*
  Warnings:

  - The values [Baldia,Surjani] on the enum `Exchange` will be removed. If these variants are still used in the database, this will fail.
  - The values [KTR_I] on the enum `Region` will be removed. If these variants are still used in the database, this will fail.
  - The primary key for the `Employee` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the `Network` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Exchange_new" AS ENUM ('KAP', 'SITE', 'Hijri', 'Johar', 'Malir', 'Hadeed', 'Maymar', 'Orangi', 'Gulshan', 'Azizabad', 'Nazimabad', 'Pak_Capital', 'North_Karachi');
ALTER TABLE "Employee" ALTER COLUMN "exchange" TYPE "Exchange_new" USING ("exchange"::text::"Exchange_new");
ALTER TYPE "Exchange" RENAME TO "Exchange_old";
ALTER TYPE "Exchange_new" RENAME TO "Exchange";
DROP TYPE "Exchange_old";
COMMIT;

-- AlterEnum
ALTER TYPE "JobRole" ADD VALUE 'MGT';

-- AlterEnum
ALTER TYPE "JobType" ADD VALUE 'MGT';

-- AlterEnum
BEGIN;
CREATE TYPE "Region_new" AS ENUM ('KTR_II', 'KTR_III');
ALTER TABLE "Employee" ALTER COLUMN "region" TYPE "Region_new" USING ("region"::text::"Region_new");
ALTER TYPE "Region" RENAME TO "Region_old";
ALTER TYPE "Region_new" RENAME TO "Region";
DROP TYPE "Region_old";
COMMIT;

-- AlterTable
ALTER TABLE "Employee" DROP CONSTRAINT "Employee_pkey",
ALTER COLUMN "epi" SET DATA TYPE TEXT USING "epi"::TEXT,
ADD CONSTRAINT "Employee_pkey" PRIMARY KEY ("epi");

-- AlterTable
ALTER TABLE "FSA" ALTER COLUMN "epi" SET DATA TYPE TEXT USING "epi"::TEXT;

-- AlterTable
ALTER TABLE "TSA" ALTER COLUMN "epi" SET DATA TYPE TEXT USING "epi"::TEXT;


-- DropTable
DROP TABLE "Network";
