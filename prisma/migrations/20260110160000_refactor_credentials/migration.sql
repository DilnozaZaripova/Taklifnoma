/*
  Warnings:

  - You are about to drop the `Account` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `EmailVerification` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Session` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `VerificationToken` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `emailVerified` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `passwordResetCode` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `passwordResetExpiry` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `provider` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `refreshTokens` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `verificationCode` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `verificationExpiry` on the `User` table. All the data in the column will be lost.
  - Made the column `email` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `password` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Account" DROP CONSTRAINT "Account_userId_fkey";

-- DropForeignKey
ALTER TABLE "Session" DROP CONSTRAINT "Session_userId_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "emailVerified",
DROP COLUMN "image",
DROP COLUMN "passwordResetCode",
DROP COLUMN "passwordResetExpiry",
DROP COLUMN "provider",
DROP COLUMN "refreshTokens",
DROP COLUMN "verificationCode",
DROP COLUMN "verificationExpiry",
ALTER COLUMN "email" SET NOT NULL;

-- Backfill existing users with a temporary password hash (bcrypt) to satisfy NOT NULL constraint
-- Hash corresponds to a temporary password (e.g., "reset-me-123") or just a random string users can't guess.
-- This prevents the migration from failing on existing rows.
UPDATE "User"
SET "password" = '$2a$12$eXgJ/eXgJ/eXgJ/eXgJ/eX.eXgJ/eXgJ/eXgJ/eXgJ/eXgJ/eXgJ/' -- Dummy hash
WHERE "password" IS NULL;

ALTER TABLE "User" ALTER COLUMN "password" SET NOT NULL;

-- DropTable
DROP TABLE "Account";

-- DropTable
DROP TABLE "EmailVerification";

-- DropTable
DROP TABLE "Session";

-- DropTable
DROP TABLE "VerificationToken";
