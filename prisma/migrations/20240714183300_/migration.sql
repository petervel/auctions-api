/*
  Warnings:

  - A unique constraint covering the columns `[username,postTimestamp]` on the table `ItemComment` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[username,postTimestamp]` on the table `ListComment` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `postTimestamp` to the `ItemComment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `postTimestamp` to the `ListComment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `ItemComment` ADD COLUMN `postTimestamp` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `ListComment` ADD COLUMN `postTimestamp` INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `ItemComment_username_postTimestamp_key` ON `ItemComment`(`username`, `postTimestamp`);

-- CreateIndex
CREATE UNIQUE INDEX `ListComment_username_postTimestamp_key` ON `ListComment`(`username`, `postTimestamp`);
