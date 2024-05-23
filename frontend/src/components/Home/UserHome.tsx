// import PostsPreview from '@/components/PostsPreview/PostsPreview';
import useGeo from '@/hooks/useGeo';
import { Session } from '@supabase/supabase-js';
import { ChevronUp } from 'lucide-react';
import { Link } from 'wouter';
import GeoSpecificSplashMessage from '../Geo/GeoSpecificSplashMessage/GeoSpecificSplashMessage';
import UnknownLocation from '../Geo/UnknownLocation/UnknownLocation';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

export default function UserHome({ session }: { session: Session }) {
  // TODO / FIXME - maybe define proper types here for these values and then somehow utilize them in all the components that use em??? IDK!
  const [, forecast, reverseGeoCoords, overwriteGeoCoords] = useGeo();
  // const forecastScope = 'daily';

  return (
    <div className="flex flex-col items-center align-middle *:my-2.5">
      <h1 className="scroll-m-20 font-extrabold tracking-tight text-5xl sm:text-4xl lg:text-5xl break-words text-center sm:text-center ">
        {new Date().getHours() >= 5 && new Date().getHours() < 12
          ? 'Good morning'
          : new Date().getHours() >= 12 && new Date().getHours() < 18
          ? 'Good afternoon'
          : 'Good evening'}
        {`, ${session.user?.user_metadata.name.split(' ')[0]}`}
      </h1>

      {/* If we dont have the reverse geocoded address of the user, then the forecast message modal they get is the UnkownLocation one */}
      {!reverseGeoCoords ? (
        <UnknownLocation overwriteGeoCoords={overwriteGeoCoords} />
      ) : (
        <>
          <div
            id="rain-stats-wrap"
            className="flex flex-col sm:flex-row md:flex-row w-full sm:w-3/4 items-center justify-center align-middle *:p-2"
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
            className="flex flex-row w-full align-center place-items-center place-content-center "
          >
            <div>
              <Link href="/create-post">
                <Button
                  className="p-6 text-lg w-full rounded-l-full"
                  variant="supabasianPrimary"
                >
                  Post a Cat!
                </Button>
              </Link>
            </div>
            <div className="h-full">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="supabasianSecondary"
                    className="rounded-r-full h-full"
                  >
                    <ChevronUp size={24} />
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent className="w-56">
                  <DropdownMenuLabel>View Posts</DropdownMenuLabel>
                  <DropdownMenuSeparator />

                  <DropdownMenuGroup>
                    <DropdownMenuItem>
                      {' '}
                      <Link href="/posts/nearby">
                        <Button className="p-3 w-full" variant="funky">
                          Near You
                        </Button>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      {' '}
                      <Link href="/posts/">
                        <Button className="p-3 w-full animate-bg outline-text ">
                          Random
                        </Button>
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>

                  {/* TODO - add forecast scoping */}
                  {/* <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem disabled={forecastScope === 'weekly'}>
                      Weekly Forecast
                    </DropdownMenuItem>
                    <DropdownMenuItem disabled={forecastScope === 'daily'}>
                      Daily Forecast
                    </DropdownMenuItem>
                  </DropdownMenuGroup> */}
                </DropdownMenuContent>
              </DropdownMenu>
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
