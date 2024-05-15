// import PostsPreview from '@/components/PostsPreview/PostsPreview';
import useGeo from '@/hooks/useGeo';
import { Session } from '@supabase/supabase-js';
import { Link } from 'wouter';
import GeoSpecificSplashMessage from '../Geo/GeoSpecificSplashMessage/GeoSpecificSplashMessage';
import UnknownLocation from '../Geo/UnknownLocation/UnknownLocation';
import { Button } from '../ui/button';

export default function UserHome({ session }: { session: Session }) {
  // TODO / FIXME - maybe define proper types here for these values and then somehow utilize them in all the components that use em??? IDK!
  const [, forecast, reverseGeoCoords, overwriteGeoCoords] = useGeo();

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
            className="flex flex-row sm:flex-row w-full align-center place-items-center place-content-center *:my-2.5 *:sm:my-0"
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
            <div>
              <Link href="/posts/nearby">
                <Button
                  className="p-6 text-lg w-full rounded-r-full"
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
