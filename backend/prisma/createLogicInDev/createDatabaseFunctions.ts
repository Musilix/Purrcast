export const createFunctionsIHateThisWhatIsPrismaReallyGoodFor = async (
  prisma,
) => {
  createGetClosestCity(prisma);
  createPredictionFunction(prisma);
};

const createGetClosestCity = async (prisma) => {
  await prisma.$queryRaw`CREATE OR REPLACE FUNCTION "geo"."get_closest_city"(lat float, long float)
  RETURNS TABLE (
    id_city "geo"."us_cities"."id"%TYPE,
    city "geo"."us_cities"."city"%TYPE,
    id_state "geo"."us_states"."id"%TYPE,
    state "geo"."us_states"."state_code"%TYPE,
    lat float,
    long float,
    "Distance in Miles from City" float
  )
  LANGUAGE SQL
  AS $$
    SELECT
      cities."id",
      cities."city",
      states."id",
      states."state_code" as state,
      cities."latitude" as city_lat,
      cities."longitude" as city_long,
      st_distance(st_point(cities."longitude", cities."latitude"), st_point(long, lat)::geography) * 0.000621371  as "Distance in Miles from City"
    FROM "geo"."us_cities" as cities
    JOIN "geo"."us_states" as states on states."id" = cities."id_state"
    ORDER BY st_point(cities."longitude", cities."latitude") <-> st_point(long, lat)::geography
    LIMIT 1
  $$`;
};

const createPredictionFunction = async (prisma) => {
  await prisma.$queryRaw`CREATE OR REPLACE FUNCTION "predictions"."generate_location_predictions"()
    RETURNS VOID
    LANGUAGE PLPGSQL
    AS $$
    DECLARE currLocation RECORD;
    DECLARE catsOnHead INTEGER := 0;
    DECLARE catsNotOnHead INTEGER := 0;
    DECLARE catsUnknown INTEGER := 0;
    DECLARE chanceOfRain INTEGER;
    BEGIN
      FOR currLocation IN 
        SELECT DISTINCT "postState", "postCity" 
        FROM "Post"
        WHERE 
          "createdAt" >= DATE_TRUNC('day', NOW()) AND
          "createdAt" < DATE_TRUNC('day', NOW() + INTERVAL '1 day')
      LOOP
        SELECT 
          COUNT(*) FILTER (WHERE "isCatOnHead" = true),
          COUNT(*) FILTER (WHERE "isCatOnHead" = false),
          COUNT(*) FILTER (WHERE "isCatOnHead" IS NULL)
        INTO catsOnHead, catsNotOnHead, catsUnknown
        FROM "Post"
        WHERE 
          ("postState" = currLocation."postState" AND "postCity" = currLocation."postCity") AND
          "isDeleted" = false AND
          "published" = true;
    
        IF (catsOnHead + catsNotOnHead > 0) THEN
            chanceOfRain := ROUND(catsOnHead::NUMERIC / (catsOnHead + catsNotOnHead), 2) * 100;
        ELSE
            chanceOfRain := 0;
        END IF;
    
        --upsert functionality
        INSERT INTO "predictions"."Predictions" ("us_state", "us_city", "date", "prediction")
        VALUES (currLocation."postState", currLocation."postCity", now(), chanceOfRain)
        ON CONFLICT ("us_state", "us_city", "date")
        DO UPDATE SET 
          "prediction" = chanceOfRain;
    
      END LOOP;
    END;
    $$;`;
};
