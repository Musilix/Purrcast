-- CreateTable
CREATE TABLE "predictions"."WeeklyPredictions" (
    "prediction" INTEGER NOT NULL,
    "weekPivot" DATE NOT NULL,
    "us_state" INTEGER NOT NULL,
    "us_city" INTEGER NOT NULL,

    CONSTRAINT "WeeklyPredictions_pkey" PRIMARY KEY ("us_state","us_city")
);

-- AddForeignKey
ALTER TABLE "predictions"."WeeklyPredictions" ADD CONSTRAINT "WeeklyPredictions_us_state_fkey" FOREIGN KEY ("us_state") REFERENCES "geo"."us_states"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "predictions"."WeeklyPredictions" ADD CONSTRAINT "WeeklyPredictions_us_city_fkey" FOREIGN KEY ("us_city") REFERENCES "geo"."us_cities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
