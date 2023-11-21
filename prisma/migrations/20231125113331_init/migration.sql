-- CreateEnum
CREATE TYPE "DatabaseStatus" AS ENUM ('Active', 'Locked', 'Deleted');

-- CreateEnum
CREATE TYPE "DBMS" AS ENUM ('mongodb', 'mysql', 'postgresql');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "otp" TEXT,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Database" (
    "id" TEXT NOT NULL,
    "type" "DBMS" NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "size" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "encryptedPassword" TEXT NOT NULL,
    "encryptedConnectionUrl" TEXT NOT NULL,
    "encryptedUsername" TEXT NOT NULL,
    "status" "DatabaseStatus" NOT NULL,

    CONSTRAINT "Database_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_otp_key" ON "User"("otp");

-- CreateIndex
CREATE UNIQUE INDEX "Database_name_type_key" ON "Database"("name", "type");

-- AddForeignKey
ALTER TABLE "Database" ADD CONSTRAINT "Database_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
