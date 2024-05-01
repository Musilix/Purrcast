import { useToast } from '@/components/ui/use-toast';
import { ContentLoadingContext } from '@/context/ContentLoadingContext';
import ShowGeoErrorMessage from '@/utils/ShowGeoErrorMessage';
import axios from 'axios';
import { useContext, useEffect } from 'react';
import useForecast from './useForecast';
import useLocalStorage from './useLocalStorage';

export interface Coordinates {
  lat: number;
  lon: number;
}

export interface ReverseGeocodedLocation {
  city: string;
  state: string;
  lat: number;
  lon: number;
  id_state: number;
  id_city: number;
  dist_from_city_in_miles: number;
}

interface UserSession {
  access_token: string;
}

/*
    Abstract: I wanted to avoid using googles geolocation API for reverse geocoding, so I opted to set up a DB table with city/state pairings, and coordinates,
    How it Should Work: Since I am cutting corners, I will have to take the loss and make a roundtrip each time we are initializing the useGeo hook
                        1. We will either ask the user for their location, or if they've already allowed us, we will jump straight to storing the coords in geoCoords
                        2. From there, we will make a request to our backend to get the city/state pairings, and then we will store that in reverseGeocodeCoords. 
                            - This will be used for Predictions and presenting the name of their current city, State to them throughout the UI
                        3. Each time, we initialize useGeo and make this round trip to get the city/state pairings, we will store those details in local storage
                            - This should help us avoid making the same request each time we initialize useGeo
                            - BUT, we still need to provide a button for the user to manually override that and go through the whole round trip again, if for instance, they have
                            moved to a new city, are traveling, etc. This is because local storage will be persistent forever and would in turn need to be manually updated.
*/
export default function useGeo() {
  // Utilize local storage for long term persistence alongside the state that we keep track of
  const [geoCoords, setUserLocationCoords] =
    useLocalStorage<Coordinates | null>('userLocationCoords');
  const [reverseGeoCoords, setUserLocationText] =
    useLocalStorage<ReverseGeocodedLocation | null>('userLocationText');
  const [forecast, setForecast] = useForecast(reverseGeoCoords);

  const { toast } = useToast();
  const { isContentLoading, setIsContentLoading } = useContext(
    ContentLoadingContext,
  );

  const userSession = JSON.parse(
    localStorage.getItem('userSession') ?? '{}',
  ) as UserSession;

  const requestGeocode = async () => {
    if (!navigator.geolocation) {
      toast({
        description: 'Geolocation is not supported by your browser',
        variant: 'destructive',
      });
      return;
    }
    // Get the current position upon reference to the useGeo() hook
    // Should we actively update the geoCoordinates upon each reference to the geoCoordinates state though? Idk for now
    navigator.geolocation.getCurrentPosition(
      (position) => {
        // Update local storage with retrieved coords
        setUserLocationCoords({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });

        // Make a request to our backend to get the city/state pairings
        getAndSetReverseGeoLoc(geoCoords);
      },
      (error) => {
        // Notice that we set is content loading to false each time we reach an error in the geolocation process
        setIsContentLoading(false);
        ShowGeoErrorMessage(error, toast);
      },
    );
  };

  const overwriteGeoCoords = async () => {
    await requestGeocode();
  };

  const clearAllGeoCoords = () => {
    console.log('CLEARING ALL GEO COORDS');
    setUserLocationText(null);
    setUserLocationCoords(null);
    setForecast(null);
  };

  const getAndSetReverseGeoLoc = async (geoCoords: Coordinates) => {
    !isContentLoading ? setIsContentLoading(true) : '';

    // If we don't have the coords for whatever reason (maybe React was faster than the geolocation api), we will return
    if (!geoCoords) {
      return;
    }

    return await axios
      .post(`${import.meta.env.VITE_API_HOST}/users/location`, geoCoords, {
        headers: {
          Authorization: `Bearer ${userSession.access_token}`,
        },
      })
      .then((res) => {
        setUserLocationText(res.data);
      })
      .catch((error) => {
        // Notice that we set is content loading to false each time we reach an error in the geolocation process
        setIsContentLoading(false);
        toast({
          description: `${error.message}: Unable to get your city and state.`,
          variant: 'destructive',
        });
      });
  };

  useEffect(() => {
    // If we have the coords, but not the reverseGeocodedLocation, we will make a request to our backend to get the city/state pairings
    if (geoCoords && !reverseGeoCoords) {
      getAndSetReverseGeoLoc(geoCoords);
      // Else if we either don't have the geoCoords or dont have both the geoCoords and reverseGeoCoords, we will make a request to get the coords
    } else if (
      (!geoCoords && reverseGeoCoords) ||
      (!geoCoords && !reverseGeoCoords)
    ) {
      requestGeocode();
    }

    setIsContentLoading(false);
  }, [geoCoords]);

  return [
    geoCoords,
    forecast,
    reverseGeoCoords,
    overwriteGeoCoords,
    clearAllGeoCoords,
  ];
}
