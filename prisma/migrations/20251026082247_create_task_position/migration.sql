/*
  Warnings:

  - You are about to drop the column `positionX` on the `Task` table. All the data in the column will be lost.
  - You are about to drop the column `positionY` on the `Task` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Task" DROP COLUMN "positionX",
DROP COLUMN "positionY";

-- CreateTable
CREATE TABLE "public"."TaskPosition" (
    "id" TEXT NOT NULL,
    "positionX" DOUBLE PRECISION NOT NULL,
    "positionY" DOUBLE PRECISION NOT NULL,
    "taskId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TaskPosition_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."TaskPosition" ADD CONSTRAINT "TaskPosition_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "public"."Task"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
