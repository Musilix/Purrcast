import { useToast } from '@/components/ui/use-toast';
import { ContentLoadingContext } from '@/context/ContentLoadingContext';
import ShowGeoErrorMessage from '@/utils/ShowGeoErrorMessage';
import axios from 'axios';
import { useContext, useEffect } from 'react';
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
  'Distance in Miles from City': number;
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
    useLocalStorage<Coordinates>('userLocationCoords');
  const [reverseGeoCoords, setUserLocationText] =
    useLocalStorage<ReverseGeocodedLocation>('userLocationText');

  const { toast } = useToast();
  const { isContentLoading, setIsContentLoading } = useContext(
    ContentLoadingContext,
  );

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
        ShowGeoErrorMessage(error, toast);
      },
    );
  };

  const overwriteGeoCoords = async () => {
    await requestGeocode();
  };

  const getAndSetReverseGeoLoc = async (geoCoords: Coordinates) => {
    setIsContentLoading(true);
    // get readable user location bundle
    return await axios
      .post(`${import.meta.env.VITE_API_HOST}/users/location`, geoCoords)
      .then((res) => {
        setUserLocationText(res.data);
        isContentLoading ? setIsContentLoading(false) : '';
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
  }, [geoCoords]);

  return [geoCoords, reverseGeoCoords, overwriteGeoCoords];
}

// TODO - maybe move this into the component itself so we dont gotta pass it so much junk?
// const getAndSetReverseGeoLoc = async (
//   geoCoords: Coordinates,
//   setUserLocationText: (location: ReverseGeocodedLocation) => void,
//   setIsContentLoading: (loading: boolean) => void,
// ) => {
//   setIsContentLoading(true);
//   // get readable user location bundle
//   return await axios
//     .post(`${import.meta.env.VITE_API_HOST}/users/location`, geoCoords)
//     .then((res) => {
//       setUserLocationText(res.data);
//       setIsContentLoading(false)
//     });
// };
