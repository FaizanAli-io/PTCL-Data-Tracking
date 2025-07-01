/*
  Warnings:

  - You are about to drop the column `code` on the `Permissions` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `Permissions` table. All the data in the column will be lost.
  - Added the required column `pass` to the `Permissions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "Exchange" ADD VALUE 'PECHS';
ALTER TYPE "Exchange" ADD VALUE 'Garden';

-- DropIndex
DROP INDEX "Permissions_email_key";

-- AlterTable
ALTER TABLE "Permissions" DROP COLUMN "code",
DROP COLUMN "email",
ADD COLUMN     "pass" TEXT NOT NULL;
