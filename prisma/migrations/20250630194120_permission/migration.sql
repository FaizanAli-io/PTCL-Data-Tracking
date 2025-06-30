-- CreateTable
CREATE TABLE "Permissions" (
    "epi" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "level" INTEGER NOT NULL,
    "code" TEXT,

    CONSTRAINT "Permissions_pkey" PRIMARY KEY ("epi")
);

-- AddForeignKey
ALTER TABLE "Permissions" ADD CONSTRAINT "Permissions_epi_fkey" FOREIGN KEY ("epi") REFERENCES "Employee"("epi") ON DELETE CASCADE ON UPDATE CASCADE;
