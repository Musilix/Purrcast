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
    "dist_from_city_in_miles" float
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
  await prisma.$queryRaw`CREATE OR REPLACE FUNCTION "predictions"."generate_daily_location_predictions" ()  
    RETURNS VOID
    LANGUAGE PLPGSQL
    AS $body$
      DECLARE currLocation RECORD;
      DECLARE catsOnHead INTEGER := 0;
      DECLARE catsNotOnHead INTEGER := 0;
      DECLARE catsUnknown INTEGER := 0;
      DECLARE chanceOfRain INTEGER;
      BEGIN
        FOR currLocation IN 
          -- Grab state, city combos that had a Post made in their vicinity for the current day.
          SELECT DISTINCT "postState", "postCity", "timeZoneOffset"
          FROM "Post"
          WHERE 
            "createdAt" - "Post"."timeZoneOffset" * interval '1 minute' >= DATE_TRUNC('day', NOW() - "Post"."timeZoneOffset" * interval '1 minute') AND
            "createdAt" - "Post"."timeZoneOffset" * interval '1 minute' < DATE_TRUNC('day', NOW() - "Post"."timeZoneOffset" * interval '1 minute' + INTERVAL '1 day')
        LOOP
          -- grab posts for the given state, city combos we're running through that are made within the current day.
          SELECT 
            COUNT(*) FILTER (WHERE "isCatOnHead" = true),
            COUNT(*) FILTER (WHERE "isCatOnHead" = false),
            COUNT(*) FILTER (WHERE "isCatOnHead" IS NULL)
          INTO catsOnHead, catsNotOnHead, catsUnknown
          FROM "Post"
          WHERE 
            ("postState" = currLocation."postState" AND "postCity" = currLocation."postCity") AND
            "isDeleted" = false AND
            "published" = true AND
            "createdAt" - currLocation."timeZoneOffset" * interval '1 minute' >= DATE_TRUNC('day', NOW() - currLocation."timeZoneOffset" * interval '1 minute') AND
            "createdAt" - currLocation."timeZoneOffset" * interval '1 minute' < DATE_TRUNC('day', NOW() - currLocation."timeZoneOffset" * interval '1 minute' + INTERVAL '1 day');
      
          IF (catsOnHead + catsNotOnHead > 0) THEN
              chanceOfRain := ROUND(catsOnHead::NUMERIC / (catsOnHead + catsNotOnHead), 2) * 100;
          ELSE
              chanceOfRain := 0;
          END IF;
      
          --upsert functionality
          INSERT INTO "predictions"."Predictions" ("us_state", "us_city", "date", "prediction")
          VALUES (currLocation."postState", currLocation."postCity", DATE_TRUNC('day', now() - currLocation."timeZoneOffset" * interval '1 minute'), chanceOfRain)
          ON CONFLICT ("us_state", "us_city", "date")
          DO UPDATE SET 
            "prediction" = chanceOfRain;
      
        END LOOP;
      END;
    $body$`;
};
