-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "geo";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "predictions";

-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "postgis";

-- AlterTable
ALTER TABLE "public"."Post" ADD COLUMN     "isCatOnHead" BOOLEAN;

-- AlterTable
ALTER TABLE "public"."Upvotes" ADD COLUMN     "location" VARCHAR(255) NOT NULL DEFAULT 'Earth';

-- CreateTable
CREATE TABLE "geo"."us_states" (
    "id" SERIAL NOT NULL,
    "state_code" TEXT NOT NULL,
    "state_name" TEXT NOT NULL,

    CONSTRAINT "us_states_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "geo"."us_cities" (
    "id" SERIAL NOT NULL,
    "city" TEXT NOT NULL,
    "county" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "id_state" INTEGER NOT NULL,

    CONSTRAINT "us_cities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "predictions"."Predictions" (
    "id" SERIAL NOT NULL,
    "prediction" INTEGER NOT NULL,
    "date" DATE NOT NULL,
    "id_state" INTEGER NOT NULL,
    "id_city" INTEGER NOT NULL,

    CONSTRAINT "Predictions_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "geo"."us_cities" ADD CONSTRAINT "us_cities_id_state_fkey" FOREIGN KEY ("id_state") REFERENCES "geo"."us_states"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "predictions"."Predictions" ADD CONSTRAINT "Predictions_id_state_fkey" FOREIGN KEY ("id_state") REFERENCES "geo"."us_states"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "predictions"."Predictions" ADD CONSTRAINT "Predictions_id_city_fkey" FOREIGN KEY ("id_city") REFERENCES "geo"."us_cities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
