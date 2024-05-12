import { Link } from 'wouter';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../../ui/card';
import GrantGeoButton from '../GrantGeoButton/GrantGeoButton';

interface geoDetails {
  reverseGeoCoords: {
    id_city: number;
    city: string;
    id_state: number;
    state: string;
    lat: number;
    long: number;
    DistanceinMilesfromCity: number;
  };
  forecast: number;
  overwriteGeoCoords: () => void;
}

export default function GeoSpecificSplashMessage({
  reverseGeoCoords,
  forecast,
  overwriteGeoCoords,
}: geoDetails) {
  return (
    <>
      {
        // Perform checks on forecast to make sure we have a proper forecast
        // IF we dont, then provide user with a modal letting them know the details of the issue + allow them the ability to try and fix it
        !forecast || forecast === undefined ? (
          <MissingForecast overwriteGeoCoords={overwriteGeoCoords} />
        ) : (
          <DailyForecast
            forecast={forecast}
            reverseGeoCoords={reverseGeoCoords}
          />
        )
      }
    </>
  );
}

export function MissingForecast({
  overwriteGeoCoords,
}: {
  overwriteGeoCoords: () => void;
}) {
  return (
    <>
      <div className="w-full flex flex-col justify-center items-center">
        <Card className="w-5/6">
          <CardHeader>
            <CardTitle>
              <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
                We're Having Issues Forecasting
              </h4>
            </CardTitle>
            <CardDescription>
              For some reason, we were unable to generate a forecast for your
              area.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="w-full font-semibold">
              To resolve the issue you could try the following
            </p>
            <div className="flex flex-row w-full">
              <img className="w-1/2" src="/error-not-found.png" />
              <ul className="my-3 ml-6 list-decimal [&>li]:mt-2">
                <li>Clearing your cookies and cache</li>
                <li>Refreshing the page</li>
                <li>Using a different browser</li>
              </ul>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col justify-between ">
            <div className=" flex flex-col items-left rounded-md border p-4 *:my-1">
              <div className="flex-1 space-y-1 ">
                <p className="text-sm font-medium leading-none">
                  Reset Location
                </p>
                <p className="text-sm text-muted-foreground">
                  If you want to skip all that, you can press the button below.
                </p>
              </div>
              <GrantGeoButton
                overwriteGeoCoords={overwriteGeoCoords}
                buttonText={'Refresh Location'}
              />
            </div>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}

export function DailyForecast({
  forecast,
  reverseGeoCoords,
}: {
  reverseGeoCoords: {
    id_city: number;
    city: string;
    id_state: number;
    state: string;
    lat: number;
    long: number;
    DistanceinMilesfromCity: number;
  };
  forecast: number;
}) {
  return (
    <>
      {/* 
          If we did get a forecast value back from the server, then check if it was negative. 
          We send back a -1 prediction if there are no predictions for the users location on the current day. This conditional handles that accordingly
        */}
      {forecast < 0 ? (
        <NotEnoughDataMessage reverseGeoCoords={reverseGeoCoords} />
      ) : (
        // This is where we handle getting an actual forecast entity back from the server
        <>
          <h1 className="scroll-m-20 font-extrabold tracking-tight text-emerald-400 text-9xl sm:text-9xl md:text-9xl break-words">
            {`${Math.floor(forecast)}%`}
          </h1>
          <h4 className="w-full sm:w-3/4 md:w-1/4 scroll-m-20 py-5 text-center sm:text-left text-pretty text-lg text-muted-foreground font-semibold tracking-tight">
            Chance of rain today in{' '}
            {`${reverseGeoCoords.city}, ${reverseGeoCoords.state}`}
          </h4>
        </>
      )}
    </>
  );
}

export function NotEnoughDataMessage({
  reverseGeoCoords,
}: {
  reverseGeoCoords: {
    id_city: number;
    city: string;
    id_state: number;
    state: string;
    lat: number;
    long: number;
    DistanceinMilesfromCity: number;
  };
}) {
  return (
    <div className="w-full flex flex-col justify-center align-middle items-center text-center">
      <h1 className="scroll-m-20 font-extrabold tracking-tight text-emerald-400 text-8xl sm:text-8xl md:text-8xl break-words">
        0%🤔
      </h1>
      <h4 className="w-full scroll-m-20 text-center  text-pretty text-lg text-muted-foreground font-semibold tracking-tight">
        Chance of rain today in{' '}
        {`${reverseGeoCoords.city}, ${reverseGeoCoords.state}`}
      </h4>
      <div className=" flex flex-col items-left rounded-md border p-4 my-2.5 *:my-1">
        <div className="flex-1 space-y-1 ">
          <p className="text-sm font-medium leading-none">
            Help Us Make a Forecast!
          </p>
          <p className="text-sm text-muted-foreground">
            We don't have enough posts for the day to generate a forecast! You
            could be the first to post! Just click the{' '}
            <Link href="/create-post" className="font-extrabold text-primary">
              Post a Cat
            </Link>{' '}
            button.
          </p>
        </div>
      </div>
    </div>
  );
}
