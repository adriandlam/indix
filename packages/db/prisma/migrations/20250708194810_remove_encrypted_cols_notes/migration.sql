/*
  Warnings:

  - You are about to drop the column `encrypted_content` on the `notes` table. All the data in the column will be lost.
  - You are about to drop the column `is_encrypted` on the `notes` table. All the data in the column will be lost.
  - Added the required column `content` to the `notes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "notes" DROP COLUMN "encrypted_content",
DROP COLUMN "is_encrypted",
ADD COLUMN     "content" TEXT NOT NULL;
