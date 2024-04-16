/*
  Warnings:

  - You are about to drop the column `id_city` on the `Predictions` table. All the data in the column will be lost.
  - You are about to drop the column `id_state` on the `Predictions` table. All the data in the column will be lost.
  - Added the required column `us_city` to the `Predictions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `us_state` to the `Predictions` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "predictions"."Predictions" DROP CONSTRAINT "Predictions_id_city_fkey";

-- DropForeignKey
ALTER TABLE "predictions"."Predictions" DROP CONSTRAINT "Predictions_id_state_fkey";

-- AlterTable
ALTER TABLE "predictions"."Predictions" DROP COLUMN "id_city",
DROP COLUMN "id_state",
ADD COLUMN     "us_city" INTEGER NOT NULL,
ADD COLUMN     "us_state" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "predictions"."Predictions" ADD CONSTRAINT "Predictions_us_state_fkey" FOREIGN KEY ("us_state") REFERENCES "geo"."us_states"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "predictions"."Predictions" ADD CONSTRAINT "Predictions_us_city_fkey" FOREIGN KEY ("us_city") REFERENCES "geo"."us_cities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
