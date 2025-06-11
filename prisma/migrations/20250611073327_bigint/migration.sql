/*
  Warnings:

  - The primary key for the `Employee` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "Employee" DROP CONSTRAINT "Employee_pkey",
ALTER COLUMN "epi" SET DATA TYPE BIGINT,
ADD CONSTRAINT "Employee_pkey" PRIMARY KEY ("epi");

-- AlterTable
ALTER TABLE "FSA" ALTER COLUMN "epi" SET DATA TYPE BIGINT;

-- AlterTable
ALTER TABLE "TSA" ALTER COLUMN "epi" SET DATA TYPE BIGINT;
