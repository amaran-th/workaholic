/*
  Warnings:

  - A unique constraint covering the columns `[memberId,no]` on the table `Task` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Task_memberId_no_key" ON "Task"("memberId", "no");
