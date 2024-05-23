import { useToast } from '@/components/ui/use-toast';
import { ContentLoadingContext } from '@/context/ContentLoadingContext';
import { UserSession } from '@/types/UserSession';
import ShowGeoErrorMessage from '@/utils/ShowGeoErrorMessage';
import axios, { AxiosError } from 'axios';
import { useContext, useEffect } from 'react';
import useForecast from './useForecast';
import useLocalStorage from './useLocalStorage';

export interface Coordinates {
  lat: number;
  lon: number;
  fingerprint: string;
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
  const [userSession] = useLocalStorage<UserSession>('userSession');

  const { toast } = useToast();
  const { setIsContentLoading } = useContext(ContentLoadingContext);

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
    // Should we also had some form of try-catch somewhere if the server fails to return a fingerprinted geoCoords object?
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        if (!position) {
          return;
        }

        const geoCoordsWithFingerPrint = (await axios
          .post(
            `${import.meta.env.VITE_API_HOST}/users/location/special-coords`,
            {
              lat: position.coords.latitude,
              lon: position.coords.longitude,
              timezoneOffset: new Date().getTimezoneOffset(),
            },
            {
              headers: {
                Authorization: `Bearer ${userSession?.access_token}`,
              },
            },
          )
          .then((res) => res.data)
          .catch((err) => {
            if (err instanceof AxiosError) {
              err.message = err.response?.data.message;
            }

            toast({
              title: 'There was an issue verifying your location',
              description: (err as Error)?.message,
              variant: 'destructive',
            });

            setIsContentLoading(false);
          })) as Coordinates;

        // Update local storage with retrieved coords only if it has a defined value
        if (geoCoordsWithFingerPrint) {
          setUserLocationCoords(geoCoordsWithFingerPrint);
        }

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
    //setUserLocationCoords(null);
    setUserLocationText(null);
    setForecast(null);
  };

  const getAndSetReverseGeoLoc = async (geoCoords: Coordinates) => {
    // If we don't have the coords for whatever reason (maybe React was faster than the geolocation api), we will return
    if (!geoCoords) {
      return;
    }

    return await axios
      .post(`${import.meta.env.VITE_API_HOST}/users/location`, geoCoords, {
        headers: {
          Authorization: `Bearer ${userSession?.access_token}`,
        },
      })
      .then((res) => {
        setUserLocationText(res.data);
      })
      .catch((err) => {
        // Notice that we set is content loading to false each time we reach an error in the geolocation process
        setIsContentLoading(false);
        if (err instanceof AxiosError) {
          err.message = err.response?.data.message;
        }

        toast({
          title: 'Unable to find your city and state',
          description: (err as Error)?.message,
          variant: 'destructive',
        });
      });
  };

  // If our coords, our reverse geocoded location, or forecast gets updated, go through the process of making
  // sure everything else in place, all while showing a content loading screen in the meantime
  useEffect(() => {
    setIsContentLoading(true);
    const controller = new AbortController();

    const updateLocationInfo = async () => {
      // If we have the coords, but not the reverseGeocodedLocation, we will make a request to our backend to get the city/state pairings
      if (geoCoords && !reverseGeoCoords) {
        await getAndSetReverseGeoLoc(geoCoords);
        // Else if we either don't have the geoCoords or dont have both the geoCoords and reverseGeoCoords, we will make a request to get the coords
      } else if (
        (!geoCoords && reverseGeoCoords) ||
        (!geoCoords && !reverseGeoCoords)
      ) {
        await requestGeocode();
      } else {
        forecast ? setIsContentLoading(false) : '';
      }
    };

    updateLocationInfo();

    return () => controller.abort();
  }, [geoCoords, reverseGeoCoords, forecast]);

  return [
    geoCoords,
    forecast,
    reverseGeoCoords,
    overwriteGeoCoords,
    clearAllGeoCoords,
  ];
}
