/*
  Warnings:

  - A unique constraint covering the columns `[taskId,date]` on the table `TaskPosition` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "TaskPosition_taskId_date_key" ON "TaskPosition"("taskId", "date");
