// import PostsPreview from '@/components/PostsPreview/PostsPreview';
import useLocalStorage from '@/hooks/useLocalStorage';
import { Session } from '@supabase/supabase-js';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link } from 'wouter';
import { Button } from '../ui/button';
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
// } from '../ui/card';

export default function UserHome({ session }: { session: Session }) {
  const [userLocationCoords, setUserLocationCoords] =
    useLocalStorage('userLocationCoords');
  const [userLocationText, setUserLocationText] =
    useLocalStorage('userLocationText');
  const [forecast, setForecast] = useState(null);

  // Upon initial page render, check if we have the users coords
  useEffect(() => {
    // query for prediction of the given location...
    // we first need to check if we even have a location. If we don't, then we go through getting that
    // once we have the location, get the predictions. boing.

    // FIXME - theres a weird issue where on intial load of a fresh page that already has geo enabled,
    // the getUserLocationText will seemingly be called before lat and long are set, resulting in error
    if (!Object.keys(userLocationText).length) {
      navigator.geolocation.getCurrentPosition((position) => {
        setUserLocationCoords({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });
      });

      const getUserLocationText = async () => {
        // get readable user location bundle
        await axios
          .post(
            `${import.meta.env.VITE_API_HOST}/users/location`,
            userLocationCoords ? userLocationCoords : {},
          )
          .then((res) => {
            setUserLocationText(res.data);
          });

        // get prediction for that location
        await axios
          .get(
            `${import.meta.env.VITE_API_HOST}/posts/forecast/${
              userLocationText.id_state
            }/${userLocationText.id_city}`,
          )
          .then((res) => {
            console.log('PREDICTION:', res.data);
          });
      };

      getUserLocationText();
    }

    if (!forecast) {
      const getForecast = async () => {
        await axios
          .get(
            `${import.meta.env.VITE_API_HOST}/post/forecast/${
              userLocationText.id_state
            }/${userLocationText.id_city}`,
          )
          .then((res) => {
            console.log('PREDICTION:', res.data);
          });
      };

      getForecast();
    }
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

      {!userLocationCoords ? (
        // <UnknownLocation
        //   userLocationCoords={userLocationCoords}
        //   setUserLocationCoords={setUserLocationText}
        //   setUserLocationText={setUserLocationCoords}
        // />
        <></>
      ) : (
        <>
          <div
            id="rain-stats-wrap"
            className="flex flex-col sm:flex-row md:flex-row w-3/4 items-center justify-center *:p-2"
          >
            <h1 className="scroll-m-20 font-extrabold tracking-tight text-emerald-400 text-9xl sm:text-9xl md:text-9xl break-words">
              {Math.floor(Math.random() * 100 + 1)}%
            </h1>
            <h4 className="w-full sm:w-3/4 md:w-1/4 scroll-m-20 text-center sm:text-left text-pretty text-lg text-muted-foreground font-semibold tracking-tight">
              Chance of rain today in{' '}
              {`${userLocationText.city}, ${userLocationText.state}`}
            </h4>
          </div>

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
        </>
      )}

      <Link href="/faq#how-do-we-make-predictions">
        <p className="text-sm text-muted-foreground cursor-pointer hover:text-foreground transition-all">
          Where are you getting this information?
        </p>
      </Link>
    </>
  );
}

// export function UnknownLocation({
//   userLocationCoords,
//   setUserLocationCoords,
//   setUserLocationText,
// }) {
//   const onLocationClick = () => {
//     navigator.geolocation.getCurrentPosition((position) => {
//       setUserLocationCoords({
//         lat: position.coords.latitude,
//         lon: position.coords.longitude,
//       });

//       const getUserLocation = async () => {
//         await axios
//           .post(
//             `${import.meta.env.VITE_API_HOST}/users/location`,
//             userLocationCoords ? JSON.parse(userLocationCoords) : {},
//           )
//           .then((res) => {
//             setUserLocationText(res.data);
//           });
//       };

//       getUserLocation();
//     });
//   };
//   return (
//     <Card
//       id="where-are-you"
//       className="flex flex-col justify-center items-center text-center my-5"
//     >
//       <CardHeader>We actually don't know where you are...</CardHeader>
//       <CardContent>
//         Please enable location services so we can give you an accurate
//         prediction
//       </CardContent>
//       <CardDescription>
//         If you're not being prompted to let us use your location, you may need
//         to go into your settings or click the map pin icon in your browser's
//         search bar.
//       </CardDescription>
//       <CardFooter className="mt-5">
//         <Button className="rounded-full" onClick={() => onLocationClick()}>
//           Use Location
//         </Button>
//       </CardFooter>
//     </Card>
//   );
// }
