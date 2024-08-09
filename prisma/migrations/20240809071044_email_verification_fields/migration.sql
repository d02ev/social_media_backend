/*
  Warnings:

  - A unique constraint covering the columns `[verification_hash]` on the table `password_details` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "password_details" ADD COLUMN     "verification_hash" VARCHAR;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "verified" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE UNIQUE INDEX "password_details_verification_hash_key" ON "password_details"("verification_hash");
