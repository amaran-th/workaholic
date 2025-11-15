/*
  Warnings:

  - You are about to drop the column `centerX` on the `Member` table. All the data in the column will be lost.
  - You are about to drop the column `centerY` on the `Member` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Member" DROP COLUMN "centerX",
DROP COLUMN "centerY",
ALTER COLUMN "bottom" SET DEFAULT 500,
ALTER COLUMN "left" SET DEFAULT -500,
ALTER COLUMN "right" SET DEFAULT 500,
ALTER COLUMN "top" SET DEFAULT -500;
