-- CreateEnum
CREATE TYPE "DatabaseStatus" AS ENUM ('Deploying', 'Active', 'Stopped', 'Deleted');

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
    "size" INTEGER NOT NULL DEFAULT 0,
    "podId" TEXT NOT NULL,
    "encryptedPassword" TEXT NOT NULL,
    "encryptedConnectionUrl" TEXT NOT NULL,
    "encryptedUsername" TEXT NOT NULL,
    "status" "DatabaseStatus" NOT NULL DEFAULT 'Deploying',

    CONSTRAINT "Database_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pod" (
    "id" TEXT NOT NULL,
    "deploymentName" TEXT NOT NULL,
    "serviceName" TEXT NOT NULL,
    "pvcName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "publicIp" TEXT,
    "internalAddress" TEXT NOT NULL,

    CONSTRAINT "Pod_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScheduledEmail" (
    "id" TEXT NOT NULL,
    "to" TEXT NOT NULL,
    "databaseId" TEXT NOT NULL,
    "podId" TEXT NOT NULL,

    CONSTRAINT "ScheduledEmail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RefreshToken" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "RefreshToken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_otp_key" ON "User"("otp");

-- CreateIndex
CREATE UNIQUE INDEX "Database_name_podId_key" ON "Database"("name", "podId");

-- CreateIndex
CREATE UNIQUE INDEX "Pod_deploymentName_key" ON "Pod"("deploymentName");

-- CreateIndex
CREATE UNIQUE INDEX "Pod_serviceName_key" ON "Pod"("serviceName");

-- CreateIndex
CREATE UNIQUE INDEX "Pod_pvcName_key" ON "Pod"("pvcName");

-- CreateIndex
CREATE UNIQUE INDEX "ScheduledEmail_databaseId_key" ON "ScheduledEmail"("databaseId");

-- AddForeignKey
ALTER TABLE "Database" ADD CONSTRAINT "Database_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Database" ADD CONSTRAINT "Database_podId_fkey" FOREIGN KEY ("podId") REFERENCES "Pod"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScheduledEmail" ADD CONSTRAINT "ScheduledEmail_databaseId_fkey" FOREIGN KEY ("databaseId") REFERENCES "Database"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScheduledEmail" ADD CONSTRAINT "ScheduledEmail_podId_fkey" FOREIGN KEY ("podId") REFERENCES "Pod"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RefreshToken" ADD CONSTRAINT "RefreshToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
