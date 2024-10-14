/*
  Warnings:

  - You are about to drop the column `fileUrl` on the `Attachment` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Task` table. All the data in the column will be lost.
  - You are about to drop the column `productManagerUserId` on the `Team` table. All the data in the column will be lost.
  - Added the required column `fileURL` to the `Attachment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `projectManagerUserId` to the `Team` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Attachment" DROP COLUMN "fileUrl",
ADD COLUMN     "fileURL" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Task" DROP COLUMN "name";

-- AlterTable
ALTER TABLE "Team" DROP COLUMN "productManagerUserId",
ADD COLUMN     "projectManagerUserId" INTEGER NOT NULL;
