/*
  Warnings:

  - You are about to drop the column `two_factor_enabled` on the `user` table. All the data in the column will be lost.
  - You are about to drop the `two_factor` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "two_factor" DROP CONSTRAINT "two_factor_user_id_fkey";

-- AlterTable
ALTER TABLE "user" DROP COLUMN "two_factor_enabled";

-- DropTable
DROP TABLE "two_factor";
