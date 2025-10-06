-- DropForeignKey
ALTER TABLE "public"."Task" DROP CONSTRAINT "Task_categoryId_fkey";

-- AlterTable
ALTER TABLE "public"."Task" ALTER COLUMN "categoryId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."Task" ADD CONSTRAINT "Task_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "public"."Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;
