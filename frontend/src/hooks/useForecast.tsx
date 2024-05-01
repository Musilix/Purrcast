import { useToast } from '@/components/ui/use-toast';
import { ContentLoadingContext } from '@/context/ContentLoadingContext';
import axios from 'axios';
import { useContext, useEffect } from 'react';
import useLocalStorage from './useLocalStorage';

export interface ReverseGeocodedLocation {
  city: string;
  state: string;
  lat: number;
  lon: number;
  id_state: number;
  id_city: number;
  dist_from_city_in_miles: number;
}

export default function useForecast(reverseGeoCoords: ReverseGeocodedLocation) {
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
    const controller = new AbortController();

    // Content should be set to loading upon mount of the UserHome component just to be safe
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

    // If we did have a forecast, then go ahead and flip that ContentLoading boolean we switched to true up there^
    isContentLoading ? setIsContentLoading(false) : '';

    return () => controller.abort();
    // getForecast(); //This may not work as we could have a forecast in local storage, but no reverseGeoCoords...
  }, [reverseGeoCoords, forecast]);

  return [forecast, setForecast];
}
