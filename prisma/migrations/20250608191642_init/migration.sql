-- CreateEnum
CREATE TYPE "Exchange" AS ENUM ('KAP', 'MMC', 'Hijri', 'Hadeed', 'Jauhar', 'Maymar', 'Gulshan', 'Azizabad', 'Nazimabad', 'Orangi_SITE', 'Pak_Capital', 'North_Karachi_Surjani');

-- CreateEnum
CREATE TYPE "DialingRemarks" AS ENUM ('Contacted_Interested', 'Contacted_Already_User', 'Contacted_Not_Interested', 'Switched_Off', 'Unresponsive');

-- CreateTable
CREATE TABLE "FSA" (
    "id" SERIAL NOT NULL,
    "epi" INTEGER NOT NULL,
    "fsaName" TEXT NOT NULL,
    "exchange" "Exchange" NOT NULL,
    "customerName" TEXT NOT NULL,
    "customerMobile" TEXT NOT NULL,
    "locationAddress" TEXT NOT NULL,
    "locationLatitude" DOUBLE PRECISION NOT NULL,
    "locationLongitude" DOUBLE PRECISION NOT NULL,
    "locationAltitude" DOUBLE PRECISION NOT NULL,
    "locationAccuracy" DOUBLE PRECISION NOT NULL,
    "currentInternetPrice" INTEGER,
    "currentInternetProvider" TEXT,
    "remarks" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FSA_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TSA" (
    "id" SERIAL NOT NULL,
    "epi" INTEGER NOT NULL,
    "tsaName" TEXT NOT NULL,
    "callerExchange" "Exchange" NOT NULL,
    "customerName" TEXT NOT NULL,
    "customerMobile" TEXT NOT NULL,
    "customerAddress" TEXT NOT NULL,
    "customerExchange" "Exchange" NOT NULL,
    "dialingRemarks" "DialingRemarks" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TSA_pkey" PRIMARY KEY ("id")
);
