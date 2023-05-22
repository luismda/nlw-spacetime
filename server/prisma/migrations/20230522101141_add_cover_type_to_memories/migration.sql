/*
  Warnings:

  - Added the required column `cover_type` to the `memories` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "CoverType" AS ENUM ('image', 'video');

-- AlterTable
ALTER TABLE "memories" ADD COLUMN     "cover_type" "CoverType" NOT NULL;
