// import PostsPreview from '@/components/PostsPreview/PostsPreview';
import useLocalStorage from '@/hooks/useLocalStorage';
import { Session } from '@supabase/supabase-js';
import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import { Link } from 'wouter';
import { Button } from '../ui/button';
import useGeo from '@/hooks/useGeo';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../ui/card';
import { ContentLoadingContext } from '@/context/ContentLoadingContext';
//TODO - move this (and the one in useGeo) to a shared location
export interface reverseGeocodedCoordinates {
  city: string;
  state: string;
  lat: number;
  lon: number;
  'Distance in Miles from City': number;
}

export default function UserHome({ session }: { session: Session }) {
  const [geoCoords, reverseGeoCoords, overwriteGeoCoords] = useGeo();
  const [forecast, setForecast] = useState(null);
  const { isContentLoading, setIsContentLoading } = useContext(
    ContentLoadingContext,
  );

  useEffect(() => {
    // If we have a userLocationText from useGeo, we can use it to get a forecast
    if (reverseGeoCoords && Object.keys(reverseGeoCoords).length && !forecast) {
      console.log('Reverse Geo Details');
      console.log(reverseGeoCoords);
      const getForecast = async () => {
        await axios
          .get(
            `${import.meta.env.VITE_API_HOST}/post/forecast/${
              reverseGeoCoords.id_state
            }/${reverseGeoCoords.id_city}`,
          )
          .then((res) => {
            console.log('PREDICTION:', res.data);
            setForecast(res.data);
            console.log('IS content loading...', isContentLoading);
            setIsContentLoading(false);
            console.log('IS content loading now...?', isContentLoading);
          })
          .catch((err) => {
            console.error(err);
          });
      };

      getForecast();
    }

    // Else, if we don't have userLocationText, that must mean the user didn't allow us to use their location
    console.error(
      'User did not allow location services or there was a server error.',
    );
  }, []);

  return (
    <>
      <h1 className="scroll-m-20 font-extrabold tracking-tight text-5xl sm:text-4xl lg:text-5xl break-words text-center sm:text-center">
        {new Date().getHours() >= 5 && new Date().getHours() < 12
          ? 'Good morning'
          : new Date().getHours() >= 12 && new Date().getHours() < 18
          ? 'Good afternoon'
          : 'Good evening'}
        {`, ${session.user?.user_metadata.name.split(' ')[0]}`}
      </h1>
      {/* <small>
        {geoCoords !== null || geoCoords !== undefined
          ? `${geoCoords.lat}, ${geoCoords.lon}`
          : ''}
      </small>
      <small>
        {reverseGeoCoords !== null || reverseGeoCoords !== undefined
          ? `${reverseGeoCoords.city}, ${reverseGeoCoords.state}`
          : ''}
      </small> */}

      {!reverseGeoCoords ? (
        <UnknownLocation overwriteGeoCoords={overwriteGeoCoords} />
      ) : (
        <>
          <div
            id="rain-stats-wrap"
            className="flex flex-col sm:flex-row md:flex-row w-3/4 items-center justify-center *:p-2"
          >
            <GeoPlaceMessage
              reverseGeoCoords={reverseGeoCoords}
              forecast={forecast}
              overwriteGeoCoords={overwriteGeoCoords}
            />
          </div>
        </>
      )}

      {reverseGeoCoords && forecast && (
        <>
          <div
            id="cta-wrap"
            className="flex flex-col sm:flex-row w-full align-center place-items-center place-content-center *:w-full sm:*:w-auto *:my-2 *:sm:m-5"
          >
            <div>
              <Link href="/create-post">
                <Button
                  className="p-6 text-lg w-full"
                  variant="supabasianPrimary"
                >
                  Post a Cat!
                </Button>
              </Link>
            </div>
            <div>
              <Link href="/posts">
                <Button
                  className="p-6 text-lg w-full"
                  variant="supabasianSecondary"
                >
                  See Posts Near You
                </Button>
              </Link>
            </div>
          </div>
          <Link href="/faq#how-do-we-make-predictions">
            <p className="text-sm text-muted-foreground cursor-pointer hover:text-foreground transition-all">
              Where are you getting this information?
            </p>
          </Link>
        </>
      )}
    </>
  );
}

// TODO - FIX THIS. This is by far the UGLIEST fucking code I've ever written, but I'm bootstrappin baybay!
export function GeoPlaceMessage({
  reverseGeoCoords,
  forecast,
  overwriteGeoCoords,
}) {
  return (
    <>
      {
        // Perform checks on forecast to make sure we have a proper forecast
        !forecast || forecast === undefined ? (
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
                    For some reason, we were unable to generate a forecast for
                    your area.
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
                        If you want to skip all that, you can press the
                        following button.
                      </p>
                    </div>
                    <GrantGeoButton
                      overwriteGeoCoords={() => {}}
                      buttonText={'Refresh Location'}
                    />
                  </div>
                </CardFooter>
              </Card>
            </div>
          </>
        ) : (
          <>
            {forecast < 0 ? (
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
                      We don't have enough posts for the day to generate a
                      forecast! You could be the first to post! Just click the{' '}
                      <Link
                        href="/create-post"
                        className="font-extrabold text-primary"
                      >
                        Post a Cat
                      </Link>{' '}
                      button.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <h1 className="scroll-m-20 font-extrabold tracking-tight text-emerald-400 text-9xl sm:text-9xl md:text-9xl break-words">
                  {`${Math.floor(forecast)}%`}
                </h1>
                <h4 className="w-full sm:w-3/4 md:w-1/4 scroll-m-20 text-center sm:text-left text-pretty text-lg text-muted-foreground font-semibold tracking-tight">
                  Chance of rain today in{' '}
                  {`${reverseGeoCoords.city}, ${reverseGeoCoords.state}`}
                </h4>
              </>
            )}
          </>
        )
      }
    </>
  );
}

export function UnknownLocation({ overwriteGeoCoords }) {
  return (
    <div
      id="where-are-you"
      className="w-full flex flex-col justify-center items-center"
    >
      <Card className="w-3/4">
        <CardHeader>
          <CardTitle>
            <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
              We actually don't know where you are...
            </h4>
          </CardTitle>
          <CardDescription>
            Please enable location services so we can give you an accurate
            prediction
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="w-full">
            {' '}
            If you're not being prompted to let us use your location, you may
            need to go into your settings or click the map pin icon in your
            browser's search bar.
          </p>
        </CardContent>
        <CardFooter className="flex flex-col justify-between ">
          <GrantGeoButton
            overwriteGeoCoords={overwriteGeoCoords}
            buttonText={'Grant Access to Location'}
          />
        </CardFooter>
      </Card>
    </div>
  );
}

export function GrantGeoButton({
  overwriteGeoCoords,
  buttonText = 'Find Posts Near You',
}) {
  const onLocationClick = () => {
    overwriteGeoCoords();
  };

  return (
    <Button
      className="rounded-md w-full"
      variant="supabasianPrimary"
      onClick={() => onLocationClick()}
    >
      {buttonText}
    </Button>
  );
}
