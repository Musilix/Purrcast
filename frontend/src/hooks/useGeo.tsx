import { useEffect } from 'react';
import useLocalStorage from './useLocalStorage';
import axios from 'axios';
import showGeoErrorMessage from '@/utils/ShowGeoErrorMessage';

export interface Coordinates {
  lat: number;
  lon: number;
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
    useLocalStorage('userLocationCoords');
  const [reverseGeoCoords, setUserLocationText] =
    useLocalStorage('userLocationText');

  const requestGeocode = async () => {
    if (!navigator.geolocation) {
      console.error('Geolocation is not supported by your browser');
      return;
    }
    console.log('Getting coordinates...');
    // Get the current position upon reference to the useGeo() hook
    // Should we actively update the geoCoordinates upon each reference to the geoCoordinates state though? Idk for now
    navigator.geolocation.getCurrentPosition((position) => {
      // Update local storage with retrieved coords
      setUserLocationCoords({
        lat: position.coords.latitude,
        lon: position.coords.longitude,
      });

      console.log('Got coordinates:');
      console.log(geoCoords);

      // Make a request to our backend to get the city/state pairings
      getAndSetReverseGeoLoc(geoCoords, setUserLocationText);
    }, showGeoErrorMessage);
  };

  const overwriteGeoCoords = async () => {
    await requestGeocode();
  };

  useEffect(() => {
    // If we have the coords, but not the reverseGeocodedLocation, we will make a request to our backend to get the city/state pairings
    if (geoCoords && !reverseGeoCoords) {
      getAndSetReverseGeoLoc(geoCoords, setUserLocationText);
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

const getAndSetReverseGeoLoc = async (
  geoCoords: Coordinates,
  setUserLocationText,
) => {
  console.log('Trying to retrieve reverse geocoded location...');
  // get readable user location bundle
  return await axios
    .post(`${import.meta.env.VITE_API_HOST}/users/location`, geoCoords)
    .then((res) => {
      console.log('Axios response: ', res.data);
      setUserLocationText(res.data);
    });
};
