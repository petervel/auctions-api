/*
  Warnings:

  - The primary key for the `ItemComment` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `ItemComment` table. All the data in the column will be lost.
  - The primary key for the `ListComment` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `ListComment` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[itemId,username,postTimestamp]` on the table `ItemComment` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[listId,username,postTimestamp]` on the table `ListComment` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX `ItemComment_username_postTimestamp_key` ON `ItemComment`;

-- DropIndex
DROP INDEX `ListComment_username_postTimestamp_key` ON `ListComment`;

-- AlterTable
ALTER TABLE `ItemComment` DROP PRIMARY KEY,
    DROP COLUMN `id`;

-- AlterTable
ALTER TABLE `ListComment` DROP PRIMARY KEY,
    DROP COLUMN `id`;

-- CreateIndex
CREATE UNIQUE INDEX `ItemComment_itemId_username_postTimestamp_key` ON `ItemComment`(`itemId`, `username`, `postTimestamp`);

-- CreateIndex
CREATE UNIQUE INDEX `ListComment_listId_username_postTimestamp_key` ON `ListComment`(`listId`, `username`, `postTimestamp`);
