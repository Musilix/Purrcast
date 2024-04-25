// import PostsPreview from '@/components/PostsPreview/PostsPreview';
import { ContentLoadingContext } from '@/context/ContentLoadingContext';
import useGeo from '@/hooks/useGeo';
import useLocalStorage from '@/hooks/useLocalStorage';
import { Session } from '@supabase/supabase-js';
import axios from 'axios';
import { useContext, useEffect } from 'react';
import { Link } from 'wouter';
import GeoSpecificSplashMessage from '../Geo/GeoSpecificSplashMessage/GeoSpecificSplashMessage';
import UnknownLocation from '../Geo/UnknownLocation/UnknownLocation';
import { Button } from '../ui/button';
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
  // TODO / FIXME - maybe define proper types here for these values and then somehow utilize them in all the components that use em??? IDK!
  const [, reverseGeoCoords, overwriteGeoCoords] = useGeo();
  const [forecast, setForecast] = useLocalStorage('forecast', null);

  const { isContentLoading, setIsContentLoading } = useContext(
    ContentLoadingContext,
  );

  const { toast } = useToast();

  // TODO - incorporate with useGeo hook?
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
        // Notice that we set is content loading to false each time we reach an error in the geolocation process
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
      getForecast(); // Should we still call getForecast to get an updated forecast? How could we make it so
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

      {/* If we dont have the reverse geocoded address of the user, then the message modal they get is the UnkownLocation one */}
      {!reverseGeoCoords ? (
        <UnknownLocation overwriteGeoCoords={overwriteGeoCoords} />
      ) : (
        <>
          <div
            id="rain-stats-wrap"
            className="flex flex-col sm:flex-row md:flex-row w-3/4 items-center justify-center *:p-2"
          >
            <GeoSpecificSplashMessage
              reverseGeoCoords={reverseGeoCoords}
              forecast={forecast}
              overwriteGeoCoords={overwriteGeoCoords}
            />
          </div>
        </>
      )}

      {/*  Conditionally show CTA and FAQ stuff */}
      {reverseGeoCoords && forecast && (
        <>
          <div
            id="cta-wrap"
            className="flex flex-col sm:flex-row w-full align-center place-items-center place-content-center *:w-full sm:*:w-auto *:my-2.5 *:sm:my-0 *:sm:mx-5"
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
              <Link href="/posts/nearby">
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

// TODO - we could maybe try to resolve the prop drilling thats going on in this component and the others below it
