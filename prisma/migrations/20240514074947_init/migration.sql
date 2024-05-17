-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `externalId` VARCHAR(191) NULL,
    `email` VARCHAR(255) NULL,
    `name` VARCHAR(255) NULL,
    `avatar` VARCHAR(255) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `User_externalId_key`(`externalId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `StripeCustomer` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `customerId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `userId` INTEGER NOT NULL,

    UNIQUE INDEX `StripeCustomer_customerId_key`(`customerId`),
    INDEX `StripeCustomer_userId_idx`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Invoice` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `type` ENUM('MEMBERSHIP', 'SERVICE', 'DEPOSIT') NOT NULL DEFAULT 'MEMBERSHIP',
    `membershipId` INTEGER NULL,
    `serviceId` INTEGER NULL,
    `status` ENUM('DRAFT', 'PENDING', 'PAID', 'EXPIRED') NOT NULL DEFAULT 'PENDING',
    `userId` INTEGER NULL,
    `currencyId` INTEGER NOT NULL DEFAULT 1,
    `userCustomerExternalId` VARCHAR(512) NULL,
    `gateway` VARCHAR(56) NULL,
    `gatewayId` VARCHAR(512) NULL,
    `details` VARCHAR(512) NULL,
    `invoiceUrl` VARCHAR(512) NULL,
    `invoicePdfUrl` VARCHAR(512) NULL,
    `subscriptionExternalId` VARCHAR(512) NULL,
    `paidAt` DATETIME(3) NULL,
    `notifiedAt` DATETIME(3) NULL,
    `dueAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Invoice_userId_currencyId_serviceId_idx`(`userId`, `currencyId`, `serviceId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Coupon` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NULL,
    `name` VARCHAR(191) NOT NULL,
    `code` VARCHAR(191) NOT NULL,
    `amountOff` DOUBLE NULL,
    `duration` ENUM('FOREVER', 'ONCE', 'REPEATING') NOT NULL DEFAULT 'FOREVER',
    `durationInMonths` INTEGER NULL,
    `maxRedemptions` INTEGER NULL,
    `percentOff` DOUBLE NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'ACTIVE',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `adminCurrenciesId` INTEGER NULL,

    UNIQUE INDEX `Coupon_code_key`(`code`),
    INDEX `Coupon_userId_idx`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CouponSettings` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `couponId` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `value` TEXT NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `CouponSettings_couponId_idx`(`couponId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PaymentMethod` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `image` VARCHAR(191) NULL,
    `currencies` TEXT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'ACTIVE',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `InvoiceItem` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `invoiceId` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `modelType` VARCHAR(191) NULL,
    `modelId` INTEGER NULL,
    `pricingBdId` INTEGER NULL,
    `pricingId` VARCHAR(191) NULL,
    `images` TEXT NULL,
    `quantity` INTEGER NOT NULL,
    `price` DOUBLE NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `InvoiceItem_invoiceId_idx`(`invoiceId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserStatus` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `description` VARCHAR(512) NULL,
    `userId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `statusUntil` DATETIME(3) NOT NULL,

    INDEX `UserStatus_userId_idx`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Membership` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `planId` INTEGER NOT NULL,
    `pricingId` INTEGER NULL,
    `currencyId` INTEGER NULL DEFAULT 1,
    `startDate` DATETIME(3) NOT NULL,
    `endDateFreeTrial` DATETIME(3) NULL,
    `endDate` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Membership_userId_key`(`userId`),
    INDEX `Membership_userId_pricingId_idx`(`userId`, `pricingId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Plan` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `stripeProductId` VARCHAR(191) NULL,
    `freeTrialDays` INTEGER NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'ACTIVE',
    `description` TEXT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Pricing` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `frequency` ENUM('TRIENNIALLY', 'BIANNUAL', 'QUARTERLY', 'YEARLY', 'SEMIANNUAL', 'MONTHLY', 'BIMONTHLY', 'WEEKLY', 'DAILY', 'LIFETIME') NOT NULL DEFAULT 'YEARLY',
    `status` VARCHAR(191) NOT NULL DEFAULT 'ACTIVE',
    `price` DOUBLE NOT NULL,
    `oldPrice` DOUBLE NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `planId` INTEGER NULL,
    `serviceId` INTEGER NULL,

    INDEX `Pricing_planId_serviceId_idx`(`planId`, `serviceId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PricingSetting` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `settingName` VARCHAR(191) NOT NULL,
    `settingValue` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `pricingId` INTEGER NULL,

    INDEX `PricingSetting_pricingId_idx`(`pricingId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Module` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `scope` ENUM('USER', 'CLIENT', 'ADMIN', 'SUPERADMIN') NOT NULL DEFAULT 'SUPERADMIN',
    `status` ENUM('ACTIVE', 'INACTIVE', 'PENDING', 'COMPLETED', 'DRAFT') NOT NULL DEFAULT 'ACTIVE',
    `description` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Permission` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AdminKpi` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `value` DOUBLE NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Referral` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `referId` INTEGER NOT NULL,
    `referredId` INTEGER NOT NULL,

    INDEX `Referral_referId_referredId_idx`(`referId`, `referredId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Capabilitie` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NULL,
    `description` TEXT NULL,
    `type` VARCHAR(191) NOT NULL DEFAULT 'LIMIT',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PlanCapabilities` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `capabilitieId` INTEGER NOT NULL,
    `planId` INTEGER NOT NULL,
    `count` INTEGER NOT NULL,
    `name` VARCHAR(191) NULL,

    INDEX `PlanCapabilities_planId_capabilitieId_idx`(`planId`, `capabilitieId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserCapabilities` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `capabilitieId` INTEGER NOT NULL,
    `userId` INTEGER NOT NULL,
    `count` INTEGER NOT NULL,

    INDEX `UserCapabilities_userId_capabilitieId_idx`(`userId`, `capabilitieId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserSetting` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `settingName` VARCHAR(128) NOT NULL,
    `settingValue` TEXT NOT NULL,

    INDEX `UserSetting_userId_idx`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SuperAdminSetting` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `settingName` VARCHAR(128) NOT NULL,
    `settingValue` TEXT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CronJobs` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `error` TEXT NULL,
    `excuteAt` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserNotes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `scope` ENUM('PERSON', 'CHURCH', 'MINISTRY', 'BUSINESS', 'ARTIST', 'PLATFORM') NOT NULL DEFAULT 'PLATFORM',
    `userId` INTEGER NOT NULL,
    `noteName` VARCHAR(128) NOT NULL,
    `noteValue` VARCHAR(191) NOT NULL,

    INDEX `UserNotes_userId_idx`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Notification` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `content` VARCHAR(191) NOT NULL,
    `image` VARCHAR(191) NOT NULL,
    `viewed` BOOLEAN NOT NULL DEFAULT false,
    `type` ENUM('MESSAGE', 'MENTION', 'FOLLOW', 'ALERT', 'ACCOUNT', 'PUBLICATION') NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AdminCurrencies` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(11) NOT NULL,
    `main` INTEGER NOT NULL DEFAULT 0,
    `code` VARCHAR(11) NOT NULL,
    `rate` DOUBLE NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserAmounts` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `currencyId` INTEGER NOT NULL DEFAULT 1,
    `amount` DOUBLE NOT NULL DEFAULT 0,
    `amount_pending` DOUBLE NOT NULL DEFAULT 0,
    `amount_stopad` DOUBLE NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `UserAmounts_userId_idx`(`userId`),
    INDEX `UserAmounts_currencyId_idx`(`currencyId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AdminMovementsAmounts` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NULL,
    `details` VARCHAR(128) NOT NULL,
    `currencyId` INTEGER NOT NULL,
    `amount` DOUBLE NOT NULL,
    `type` ENUM('DEBIT', 'CREDIT') NOT NULL DEFAULT 'CREDIT',
    `status` ENUM('ACTIVE', 'INACTIVE', 'PENDING', 'COMPLETED', 'DRAFT') NOT NULL DEFAULT 'COMPLETED',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `AdminMovementsAmounts_currencyId_idx`(`currencyId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SupportTicket` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `subject` VARCHAR(191) NOT NULL,
    `departament` ENUM('BILLING', 'SALES', 'SUPPORT') NOT NULL DEFAULT 'SALES',
    `status` ENUM('OPEN', 'UNDER_REVIEW', 'AWAITING_RESPONSE', 'CLOSED', 'REOPENED', 'CANCELED') NOT NULL DEFAULT 'OPEN',
    `userId` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `SupportTicket_userId_idx`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SupportTicketMessage` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `ticketId` INTEGER NOT NULL,
    `userId` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `SupportTicketMessage_ticketId_userId_idx`(`ticketId`, `userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SupportTicketMessageContent` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `messageId` INTEGER NOT NULL,
    `type` ENUM('TEXT', 'VIDEO', 'GALLERY', 'LINK', 'CUSTOM', 'DISCUSSION') NOT NULL DEFAULT 'TEXT',
    `content` TEXT NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `SupportTicketMessageContent_messageId_idx`(`messageId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_CouponToInvoice` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_CouponToInvoice_AB_unique`(`A`, `B`),
    INDEX `_CouponToInvoice_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_ModuleToPermission` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_ModuleToPermission_AB_unique`(`A`, `B`),
    INDEX `_ModuleToPermission_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_PermissionToUser` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_PermissionToUser_AB_unique`(`A`, `B`),
    INDEX `_PermissionToUser_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_PermissionToPlan` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_PermissionToPlan_AB_unique`(`A`, `B`),
    INDEX `_PermissionToPlan_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `StripeCustomer` ADD CONSTRAINT `StripeCustomer_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Invoice` ADD CONSTRAINT `Invoice_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Invoice` ADD CONSTRAINT `Invoice_currencyId_fkey` FOREIGN KEY (`currencyId`) REFERENCES `AdminCurrencies`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Coupon` ADD CONSTRAINT `Coupon_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Coupon` ADD CONSTRAINT `Coupon_adminCurrenciesId_fkey` FOREIGN KEY (`adminCurrenciesId`) REFERENCES `AdminCurrencies`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CouponSettings` ADD CONSTRAINT `CouponSettings_couponId_fkey` FOREIGN KEY (`couponId`) REFERENCES `Coupon`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `InvoiceItem` ADD CONSTRAINT `InvoiceItem_invoiceId_fkey` FOREIGN KEY (`invoiceId`) REFERENCES `Invoice`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserStatus` ADD CONSTRAINT `UserStatus_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Membership` ADD CONSTRAINT `Membership_planId_fkey` FOREIGN KEY (`planId`) REFERENCES `Plan`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Membership` ADD CONSTRAINT `Membership_pricingId_fkey` FOREIGN KEY (`pricingId`) REFERENCES `Pricing`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Membership` ADD CONSTRAINT `Membership_currencyId_fkey` FOREIGN KEY (`currencyId`) REFERENCES `AdminCurrencies`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Membership` ADD CONSTRAINT `Membership_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Pricing` ADD CONSTRAINT `Pricing_planId_fkey` FOREIGN KEY (`planId`) REFERENCES `Plan`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PricingSetting` ADD CONSTRAINT `PricingSetting_pricingId_fkey` FOREIGN KEY (`pricingId`) REFERENCES `Pricing`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Referral` ADD CONSTRAINT `Referral_referId_fkey` FOREIGN KEY (`referId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Referral` ADD CONSTRAINT `Referral_referredId_fkey` FOREIGN KEY (`referredId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PlanCapabilities` ADD CONSTRAINT `PlanCapabilities_planId_fkey` FOREIGN KEY (`planId`) REFERENCES `Plan`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PlanCapabilities` ADD CONSTRAINT `PlanCapabilities_capabilitieId_fkey` FOREIGN KEY (`capabilitieId`) REFERENCES `Capabilitie`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserCapabilities` ADD CONSTRAINT `UserCapabilities_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserCapabilities` ADD CONSTRAINT `UserCapabilities_capabilitieId_fkey` FOREIGN KEY (`capabilitieId`) REFERENCES `Capabilitie`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserSetting` ADD CONSTRAINT `UserSetting_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserNotes` ADD CONSTRAINT `UserNotes_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Notification` ADD CONSTRAINT `Notification_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserAmounts` ADD CONSTRAINT `UserAmounts_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserAmounts` ADD CONSTRAINT `UserAmounts_currencyId_fkey` FOREIGN KEY (`currencyId`) REFERENCES `AdminCurrencies`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AdminMovementsAmounts` ADD CONSTRAINT `AdminMovementsAmounts_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AdminMovementsAmounts` ADD CONSTRAINT `AdminMovementsAmounts_currencyId_fkey` FOREIGN KEY (`currencyId`) REFERENCES `AdminCurrencies`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SupportTicket` ADD CONSTRAINT `SupportTicket_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SupportTicketMessage` ADD CONSTRAINT `SupportTicketMessage_ticketId_fkey` FOREIGN KEY (`ticketId`) REFERENCES `SupportTicket`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SupportTicketMessage` ADD CONSTRAINT `SupportTicketMessage_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SupportTicketMessageContent` ADD CONSTRAINT `SupportTicketMessageContent_messageId_fkey` FOREIGN KEY (`messageId`) REFERENCES `SupportTicketMessage`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_CouponToInvoice` ADD CONSTRAINT `_CouponToInvoice_A_fkey` FOREIGN KEY (`A`) REFERENCES `Coupon`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_CouponToInvoice` ADD CONSTRAINT `_CouponToInvoice_B_fkey` FOREIGN KEY (`B`) REFERENCES `Invoice`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_ModuleToPermission` ADD CONSTRAINT `_ModuleToPermission_A_fkey` FOREIGN KEY (`A`) REFERENCES `Module`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_ModuleToPermission` ADD CONSTRAINT `_ModuleToPermission_B_fkey` FOREIGN KEY (`B`) REFERENCES `Permission`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_PermissionToUser` ADD CONSTRAINT `_PermissionToUser_A_fkey` FOREIGN KEY (`A`) REFERENCES `Permission`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_PermissionToUser` ADD CONSTRAINT `_PermissionToUser_B_fkey` FOREIGN KEY (`B`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_PermissionToPlan` ADD CONSTRAINT `_PermissionToPlan_A_fkey` FOREIGN KEY (`A`) REFERENCES `Permission`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_PermissionToPlan` ADD CONSTRAINT `_PermissionToPlan_B_fkey` FOREIGN KEY (`B`) REFERENCES `Plan`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
