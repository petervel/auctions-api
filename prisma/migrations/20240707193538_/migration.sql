/*
  Warnings:

  - You are about to drop the column `fairId` on the `List` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[listId]` on the table `Fair` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `listId` to the `Fair` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `List` DROP FOREIGN KEY `List_fairId_fkey`;

-- AlterTable
ALTER TABLE `Fair` ADD COLUMN `listId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `List` DROP COLUMN `fairId`;

-- CreateIndex
CREATE UNIQUE INDEX `Fair_listId_key` ON `Fair`(`listId`);

-- AddForeignKey
ALTER TABLE `Fair` ADD CONSTRAINT `Fair_listId_fkey` FOREIGN KEY (`listId`) REFERENCES `List`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
