/*
  Warnings:

  - You are about to drop the column `uuid` on the `users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[personId]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `users` DROP COLUMN `uuid`,
    ADD COLUMN `email` VARCHAR(191) NOT NULL,
    ADD COLUMN `personId` VARCHAR(100) NULL;

-- CreateTable
CREATE TABLE `person` (
    `perosnId` VARCHAR(191) NOT NULL,
    `citizenId` VARCHAR(100) NULL,
    `name` VARCHAR(100) NULL,

    UNIQUE INDEX `person_citizenId_key`(`citizenId`),
    PRIMARY KEY (`perosnId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `users_email_key` ON `users`(`email`);

-- CreateIndex
CREATE UNIQUE INDEX `users_personId_key` ON `users`(`personId`);
