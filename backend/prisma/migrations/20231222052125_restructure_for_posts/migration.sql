/*
  Warnings:

  - You are about to drop the column `content_src` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `location` on the `Post` table. All the data in the column will be lost.
  - Added the required column `contentId` to the `Post` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Post" DROP COLUMN "content_src",
DROP COLUMN "location",
ADD COLUMN     "contentId" VARCHAR(255) NOT NULL,
ALTER COLUMN "published" SET DEFAULT true;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "location" VARCHAR(255) NOT NULL DEFAULT 'Earth';
