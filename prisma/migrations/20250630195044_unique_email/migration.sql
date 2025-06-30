/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `Permissions` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Permissions_email_key" ON "Permissions"("email");
