/*
  Warnings:

  - The primary key for the `Predictions` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Predictions` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "predictions"."Predictions" DROP CONSTRAINT "Predictions_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "Predictions_pkey" PRIMARY KEY ("us_state", "us_city", "date");
