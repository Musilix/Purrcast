/*
  Warnings:

  - You are about to drop the column `title` on the `Post` table. All the data in the column will be lost.
  - Added the required column `location` to the `Post` table without a default value. This is not possible if the table is not empty.
  - Made the column `content` on table `Post` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Post" DROP COLUMN "title",
ADD COLUMN     "location" VARCHAR(255) NOT NULL,
ALTER COLUMN "content" SET NOT NULL;
