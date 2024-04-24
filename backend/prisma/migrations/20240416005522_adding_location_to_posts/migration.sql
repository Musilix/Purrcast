/*
  Warnings:

  - Added the required column `id_city` to the `Post` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_state` to the `Post` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Post" ADD COLUMN     "id_city" INTEGER NOT NULL,
ADD COLUMN     "id_state" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."Post" ADD CONSTRAINT "Post_id_state_fkey" FOREIGN KEY ("id_state") REFERENCES "geo"."us_states"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Post" ADD CONSTRAINT "Post_id_city_fkey" FOREIGN KEY ("id_city") REFERENCES "geo"."us_cities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
