-- CreateTable
CREATE TABLE `users` (
    `userId` VARCHAR(191) NOT NULL,
    `name` VARCHAR(100) NULL,
    `citizenId` VARCHAR(100) NULL,
    `password` VARCHAR(100) NULL,

    UNIQUE INDEX `users_citizenId_key`(`citizenId`),
    PRIMARY KEY (`userId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
