/*
  Warnings:

  - You are about to drop the column `listId` on the `ItemComment` table. All the data in the column will be lost.
  - You are about to drop the `ListItem` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `itemId` to the `ItemComment` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `ItemComment` DROP FOREIGN KEY `ItemComment_listId_fkey`;

-- DropForeignKey
ALTER TABLE `ListItem` DROP FOREIGN KEY `ListItem_listId_fkey`;

-- AlterTable
ALTER TABLE `ItemComment` DROP COLUMN `listId`,
    ADD COLUMN `itemId` INTEGER NOT NULL;

-- DropTable
DROP TABLE `ListItem`;

-- CreateTable
CREATE TABLE `Item` (
    `id` INTEGER NOT NULL,
    `listId` INTEGER NOT NULL,
    `objectType` VARCHAR(191) NOT NULL,
    `objectSubtype` VARCHAR(191) NOT NULL,
    `objectId` INTEGER NOT NULL,
    `objectName` VARCHAR(191) NOT NULL,
    `username` VARCHAR(191) NOT NULL,
    `postDate` DATETIME(3) NOT NULL,
    `editDate` DATETIME(3) NOT NULL,
    `thumbs` INTEGER NOT NULL,
    `imageId` INTEGER NOT NULL,
    `body` VARCHAR(191) NOT NULL,
    `deleted` BOOLEAN NOT NULL DEFAULT false,
    `language` VARCHAR(191) NULL,
    `condition` VARCHAR(191) NULL,
    `startingBid` INTEGER NULL,
    `softReserve` INTEGER NULL,
    `hardReserve` INTEGER NULL,
    `binPrice` INTEGER NULL,
    `highestBid` INTEGER NULL,
    `auctionEnd` VARCHAR(191) NULL,
    `auctionEndDate` VARCHAR(191) NULL,
    `editTimestamp` INTEGER NULL,
    `lastSeen` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Item` ADD CONSTRAINT `Item_listId_fkey` FOREIGN KEY (`listId`) REFERENCES `List`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ItemComment` ADD CONSTRAINT `ItemComment_itemId_fkey` FOREIGN KEY (`itemId`) REFERENCES `Item`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
