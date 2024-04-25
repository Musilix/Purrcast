/*
  Warnings:

  - You are about to drop the column `id_city` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `id_state` on the `Post` table. All the data in the column will be lost.
  - Added the required column `postCity` to the `Post` table without a default value. This is not possible if the table is not empty.
  - Added the required column `postState` to the `Post` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Post" DROP CONSTRAINT "Post_id_city_fkey";

-- DropForeignKey
ALTER TABLE "public"."Post" DROP CONSTRAINT "Post_id_state_fkey";

-- AlterTable
ALTER TABLE "public"."Post" DROP COLUMN "id_city",
DROP COLUMN "id_state",
ADD COLUMN     "postCity" INTEGER NOT NULL,
ADD COLUMN     "postState" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."Post" ADD CONSTRAINT "Post_postState_fkey" FOREIGN KEY ("postState") REFERENCES "geo"."us_states"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Post" ADD CONSTRAINT "Post_postCity_fkey" FOREIGN KEY ("postCity") REFERENCES "geo"."us_cities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
