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
  const { setIsContentLoading } = useContext(ContentLoadingContext);
  const { toast } = useToast();

  // TODO - incorporate with useGeo hook?
  const getForecast = async () => {
    await axios
      .post(`${import.meta.env.VITE_API_HOST}/post/forecast`, reverseGeoCoords)
      .then((res) => {
        setForecast(res.data);
      })
      .catch((err) => {
        if (err.response.data.message) {
          err.message = err.response.data.message;
        }

        // // Notice that we set is content loading to false each time we reach an error in the geolocation process
        // setIsContentLoading(false);
        toast({
          title: 'There was an issue retrieving the forecast.',
          description: err.message,
          variant: 'destructive',
        });
      });
  };

  useEffect(() => {
    const controller = new AbortController();
    const updateForecastInfo = async () => {
      // If we for sure obtained the reversed geocoded location of the user, but still don't have a forecast, then get the forecast!
      if (!forecast && reverseGeoCoords) {
        // If we have the reverse geocoded coordinates, then we can get the forecast!
        await getForecast();
      } else if (forecast && reverseGeoCoords) {
        await getForecast(); // Should we still call getForecast to get an updated forecast? How could we make it so
      }
    };

    updateForecastInfo();
    setIsContentLoading(false);

    return () => controller.abort();
    // getForecast(); //This may not work as we could have a forecast in local storage, but no reverseGeoCoords...
  }, [reverseGeoCoords]);

  return [forecast, setForecast];
}
