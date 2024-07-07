-- CreateTable
CREATE TABLE `Fair` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `status` ENUM('ACTIVE', 'ARCHIVED') NOT NULL DEFAULT 'ACTIVE',

    UNIQUE INDEX `Fair_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `List` (
    `id` INTEGER NOT NULL,
    `fairId` INTEGER NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `username` VARCHAR(191) NOT NULL,
    `postDate` DATETIME(3) NOT NULL,
    `postTimestamp` INTEGER NOT NULL,
    `editDate` DATETIME(3) NOT NULL,
    `editTimestamp` INTEGER NOT NULL,
    `thumbs` INTEGER NOT NULL,
    `itemCount` INTEGER NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `tosUrl` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `List_fairId_key`(`fairId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ListItem` (
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
    `text` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ItemComment` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `listId` INTEGER NOT NULL,
    `username` VARCHAR(191) NOT NULL,
    `date` VARCHAR(191) NOT NULL,
    `postDate` DATETIME(3) NOT NULL,
    `editDate` DATETIME(3) NOT NULL,
    `editTimestamp` INTEGER NOT NULL,
    `thumbs` INTEGER NOT NULL DEFAULT 0,
    `text` VARCHAR(191) NOT NULL,
    `isBin` BOOLEAN NOT NULL DEFAULT false,
    `bid` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `List` ADD CONSTRAINT `List_fairId_fkey` FOREIGN KEY (`fairId`) REFERENCES `Fair`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ListItem` ADD CONSTRAINT `ListItem_listId_fkey` FOREIGN KEY (`listId`) REFERENCES `List`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ListComment` ADD CONSTRAINT `ListComment_listId_fkey` FOREIGN KEY (`listId`) REFERENCES `List`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ItemComment` ADD CONSTRAINT `ItemComment_listId_fkey` FOREIGN KEY (`listId`) REFERENCES `ListItem`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
