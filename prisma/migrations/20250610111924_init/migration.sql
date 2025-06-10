-- CreateEnum
CREATE TYPE "JobType" AS ENUM ('OSP', 'Regular');

-- CreateEnum
CREATE TYPE "JobRole" AS ENUM ('FSA', 'TSA');

-- CreateEnum
CREATE TYPE "Region" AS ENUM ('KTR_I', 'KTR_II', 'KTR_III');

-- CreateEnum
CREATE TYPE "Exchange" AS ENUM ('KAP', 'SITE', 'Hijri', 'Johar', 'Malir', 'Baldia', 'Hadeed', 'Maymar', 'Orangi', 'Gulshan', 'Surjani', 'Azizabad', 'Nazimabad', 'Pak_Capital', 'North_Karachi');

-- CreateTable
CREATE TABLE "Employee" (
    "epi" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "type" "JobType" NOT NULL,
    "role" "JobRole" NOT NULL,
    "region" "Region" NOT NULL,
    "exchange" "Exchange" NOT NULL,
    "joinDate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Employee_pkey" PRIMARY KEY ("epi")
);

-- CreateTable
CREATE TABLE "FSA" (
    "id" SERIAL NOT NULL,
    "epi" INTEGER NOT NULL,
    "customerName" TEXT NOT NULL,
    "customerPSTN" TEXT,
    "customerMobile" TEXT NOT NULL,
    "customerAddress" TEXT NOT NULL,
    "customerLatitude" DOUBLE PRECISION NOT NULL,
    "customerLongitude" DOUBLE PRECISION NOT NULL,
    "currentInternetPrice" INTEGER,
    "currentInternetProvider" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "remarks" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FSA_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TSA" (
    "id" SERIAL NOT NULL,
    "epi" INTEGER NOT NULL,
    "customerName" TEXT NOT NULL,
    "customerPSTN" TEXT,
    "customerMobile" TEXT NOT NULL,
    "customerAddress" TEXT NOT NULL,
    "currentInternetPrice" INTEGER,
    "currentInternetProvider" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "remarks" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TSA_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Network" (
    "id" SERIAL NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "FDH" TEXT NOT NULL,
    "FAT" TEXT NOT NULL,

    CONSTRAINT "Network_pkey" PRIMARY KEY ("id")
);
