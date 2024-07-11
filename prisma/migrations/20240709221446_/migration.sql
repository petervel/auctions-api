-- CreateTable
CREATE TABLE `Fair` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `status` ENUM('ACTIVE', 'ARCHIVED') NOT NULL DEFAULT 'ACTIVE',
    `geeklistId` INTEGER NOT NULL,
    `listId` INTEGER NULL,

    UNIQUE INDEX `Fair_name_key`(`name`),
    UNIQUE INDEX `Fair_listId_key`(`listId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `List` (
    `id` INTEGER NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `username` VARCHAR(191) NOT NULL,
    `postDate` DATETIME(3) NOT NULL,
    `postTimestamp` INTEGER NOT NULL,
    `editDate` DATETIME(3) NOT NULL,
    `editTimestamp` INTEGER NOT NULL,
    `thumbs` INTEGER NOT NULL,
    `itemCount` INTEGER NOT NULL,
    `description` TEXT NOT NULL,
    `tosUrl` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `List_id_key`(`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Item` (
    `id` INTEGER NOT NULL,
    `listId` INTEGER NOT NULL,
    `objectType` VARCHAR(191) NOT NULL,
    `objectSubtype` VARCHAR(191) NOT NULL,
    `objectId` INTEGER NOT NULL,
    `objectName` TEXT NOT NULL,
    `username` VARCHAR(191) NOT NULL,
    `postDate` DATETIME(3) NOT NULL,
    `editDate` DATETIME(3) NOT NULL,
    `thumbs` INTEGER NOT NULL,
    `imageId` INTEGER NOT NULL,
    `body` TEXT NOT NULL,
    `deleted` BOOLEAN NOT NULL DEFAULT false,
    `language` TEXT NULL,
    `condition` TEXT NULL,
    `startingBid` INTEGER NULL,
    `softReserve` INTEGER NULL,
    `hardReserve` INTEGER NULL,
    `binPrice` INTEGER NULL,
    `highestBid` INTEGER NULL,
    `auctionEnd` TEXT NULL,
    `auctionEndDate` TEXT NULL,
    `editTimestamp` INTEGER NULL,
    `lastSeen` INTEGER NULL,

    UNIQUE INDEX `Item_id_key`(`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ListComment` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `listId` INTEGER NOT NULL,
    `username` VARCHAR(191) NOT NULL,
    `date` VARCHAR(191) NOT NULL,
    `postDate` DATETIME(3) NOT NULL,
    `editDate` DATETIME(3) NOT NULL,
    `editTimestamp` INTEGER NOT NULL,
    `thumbs` INTEGER NOT NULL DEFAULT 0,
    `text` TEXT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ItemComment` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `itemId` INTEGER NOT NULL,
    `username` VARCHAR(191) NOT NULL,
    `date` VARCHAR(191) NOT NULL,
    `postDate` DATETIME(3) NOT NULL,
    `editDate` DATETIME(3) NOT NULL,
    `editTimestamp` INTEGER NOT NULL,
    `thumbs` INTEGER NOT NULL DEFAULT 0,
    `text` TEXT NOT NULL,
    `isBin` BOOLEAN NOT NULL DEFAULT false,
    `bid` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Fair` ADD CONSTRAINT `Fair_listId_fkey` FOREIGN KEY (`listId`) REFERENCES `List`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Item` ADD CONSTRAINT `Item_listId_fkey` FOREIGN KEY (`listId`) REFERENCES `List`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ListComment` ADD CONSTRAINT `ListComment_listId_fkey` FOREIGN KEY (`listId`) REFERENCES `List`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ItemComment` ADD CONSTRAINT `ItemComment_itemId_fkey` FOREIGN KEY (`itemId`) REFERENCES `Item`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
