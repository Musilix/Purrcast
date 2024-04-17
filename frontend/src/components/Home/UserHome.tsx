// import PostsPreview from '@/components/PostsPreview/PostsPreview';
import { ContentLoadingContext } from '@/context/ContentLoadingContext';
import useGeo from '@/hooks/useGeo';
import useLocalStorage from '@/hooks/useLocalStorage';
import { Session } from '@supabase/supabase-js';
import axios from 'axios';
import { useContext, useEffect } from 'react';
import { Link } from 'wouter';
import { Button } from '../ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../ui/card';
import { useToast } from '../ui/use-toast';
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
  const [forecast, setForecast] = useLocalStorage('forecast', null);

  const { isContentLoading, setIsContentLoading } = useContext(
    ContentLoadingContext,
  );

  const { toast } = useToast();

  const getForecast = async () => {
    await axios
      .get(
        `${import.meta.env.VITE_API_HOST}/post/forecast/${
          reverseGeoCoords.id_state
        }/${reverseGeoCoords.id_city}`,
      )
      .then((res) => {
        setForecast(res.data);
      })
      .catch((err) => {
        setIsContentLoading(false);
        toast({
          description: err.message + '. Maybe try refreshing the page?',
          variant: 'destructive',
        });
      });
  };

  useEffect(() => {
    // Content is loading upon mount of the UserHome component
    !isContentLoading ? setIsContentLoading(true) : '';

    // If we for sure obtained the reversed geocoded location of the user, but still don't have a forecast, then get the forecast!
    if (!forecast) {
      // If we have the reverse geocoded coordinates, then we can get the forecast!
      if (reverseGeoCoords && Object.keys(reverseGeoCoords).length) {
        getForecast();
      }

      // else {
      //   toast({
      //     description:
      //       'There was an issue getting your location. Please try refreshing the page or disabling and re-enabling location services.',
      //     variant: 'destructive',
      //   });
      // }
    } else if (forecast && reverseGeoCoords) {
      // For some reason, isContentLoading ? setIsContentLoading(false) : ''; wasn't working properly...
      setIsContentLoading(false);
      // getForecast(); // Should we still call getForecast to get an updated forecast? How could we make it so
    }

    // setIsContentLoading(false);
    // getForecast(); //This may not work as we could have a forecast in local storage, but no reverseGeoCoords...
  }, [reverseGeoCoords, forecast]);

  return (
    <div className="flex flex-col items-center align-middle *:my-2.5">
      <h1 className="scroll-m-20 font-extrabold tracking-tight text-5xl sm:text-4xl lg:text-5xl break-words text-center sm:text-center">
        {new Date().getHours() >= 5 && new Date().getHours() < 12
          ? 'Good morning'
          : new Date().getHours() >= 12 && new Date().getHours() < 18
          ? 'Good afternoon'
          : 'Good evening'}
        {`, ${session.user?.user_metadata.name.split(' ')[0]}`}
      </h1>
      {/* Uf we dont have the reverse geocoded address of the user, then the message modal they get is the UnkownLocation one */}
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
            className="flex flex-col sm:flex-row w-full align-center place-items-center place-content-center *:w-full sm:*:w-auto *:sm:mx-5"
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
    </div>
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
        // IF we dont, then provide user with a modal letting them know the details of the issue + allow them the ability to try and fix it
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
                      overwriteGeoCoords={overwriteGeoCoords}
                      buttonText={'Refresh Location'}
                    />
                  </div>
                </CardFooter>
              </Card>
            </div>
          </>
        ) : (
          <>
            {/* 
                If we did get a forecast value back from the server, then check if it was negative. 
                We send back a -1 prediction if there are no predictions for the users location on the current day. This conditional handles that accordingly
              */}
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
              // This is where we handle getting an actual forecast entity back from the server
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

// TODO - we could maybe try to resolve the prop drilling thats going on in this component and the others below it
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

// DO we really need this to be a standalone component?
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
