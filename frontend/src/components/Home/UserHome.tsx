// import PostsPreview from '@/components/PostsPreview/PostsPreview';
import { Session } from '@supabase/supabase-js';
import { Link } from 'wouter';
import { Button } from '../ui/button';
import { useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from '../ui/card';

export default function UserHome({ session }: { session: Session }) {
  const userLocation = localStorage.getItem('userLocation');
  console.log(userLocation);
  useEffect(() => {
    if (!userLocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        localStorage.setItem(
          'userLocation',
          JSON.stringify({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          }),
        );
      });
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

      {!userLocation ? (
        <UnknownLocation />
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
              Chance of rain today in Corvallis, OR.
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

export function UnknownLocation() {
  const onLocationClick = () => {
    console.log("I'm clickeds");
    navigator.geolocation.getCurrentPosition((position) => {
      localStorage.setItem(
        'userLocation',
        JSON.stringify({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        }),
      );
    });
  };
  return (
    <Card
      id="where-are-you"
      className="flex flex-col justify-center items-center text-center my-5"
    >
      <CardHeader>We actually don't know where you are...</CardHeader>
      <CardContent>
        Please enable location services so we can give you an accurate
        prediction
      </CardContent>
      <CardDescription>
        If you're not being prompted to let us use your location, you may need
        to go into your settings or click the map pin icon in your browser's
        search bar.
      </CardDescription>
      <CardFooter>
        <Button className="rounded-full" onClick={() => onLocationClick()}>
          Use Location
        </Button>
      </CardFooter>
    </Card>
  );
}
