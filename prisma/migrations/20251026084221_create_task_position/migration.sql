/*
  Warnings:

  - You are about to drop the column `createdAt` on the `TaskPosition` table. All the data in the column will be lost.
  - Added the required column `date` to the `TaskPosition` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."TaskPosition" DROP COLUMN "createdAt",
ADD COLUMN     "date" TEXT NOT NULL;
