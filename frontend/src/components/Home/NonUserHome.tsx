import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Link } from 'wouter';
import { Card } from '../ui/card';

export default function NonUserHome() {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  return (
    <>
      <h1 className="text-center font-bold leading-tight tracking-tighter text-5xl md:text-6xl lg:leading-[1.1] md:block">
        {import.meta.env.PROD ? 'Purrcast' : 'Purrcast Test Feed'}
      </h1>

      <p className="max-w-[750px] text-center text-md md:text-lg text-muted-foreground sm:text-xl !my-0">
        The weather app made by cats.
      </p>

      <div
        id="splash-intro-wrap"
        className="relative !my-5 p-5 flex flex-col justify-center items-center"
      >
        <img
          src="/purrcaster-home-temp.png"
          className={`${
            isImageLoaded ? 'opacity-1' : 'opacity-0 -mb-[100px] '
          } -z-10 w-3/4 min-w-[100px] max-w-3/4 -m-[20px] sm:-m-[20px] md:-m-[20px] lg:-m-[20px] transition-all duration-500 ease-in-out`}
          onLoad={() => {
            setIsImageLoaded(true);
          }}
        />

        <Card className="z-10 w-full md:w-full p-6 max-w-[500px] min-w-[300px] text-center">
          {/* create an absolute positioned triangle div that makes it's parent div look like a speech bubble */}
          {/* <div className='absolute -bottom-6 left-2 w-[25px] h-[25px] border-solid border-b-slate-400  border-r-slate-400 border-opacity-0 border-8'></div> */}

          <p className="text-lg font-semibold">An old soothsayer once said</p>
          <p className="text-sm text-muted-foreground">
            When your cats head is low, the clouds are soon to grow.
          </p>
          <p className="leading-7 [&:not(:first-child)]:mt-6 break-keep">
            I took that very personally and so Purrcast was built to act as a
            centralized place for you to post and look at photos of peoples cats
            in your area to determine if it's going to rain soon or maybe just
            drizzle.
          </p>
        </Card>
      </div>

      <div
        id="splash-buttons"
        className="flex flex-col md:flex-row lg:flex-row justify-center align-middle w-5/6 sm:w-3/4 md:w-full mt-4 *:mx-0 *:sm:mx-2 space-y-4 md:space-y-0 lg:space-y-0 "
      >
        <Link href="/posts/nearby">
          <Button className="p-6 text-lg w-full md:w-1/4" variant="funky">
            Posts Near You
          </Button>
        </Link>
        <Link href="/create-post">
          <Button
            className="p-6 text-lg w-full md:w-1/2 "
            variant="supabasianPrimary"
          >
            Post a Cat
          </Button>
        </Link>
        <Link href="/faq">
          <Button
            className="p-6 text-lg flex-1 w-full md:w-1/4"
            variant="supabasianSecondary"
          >
            I'm Confused
          </Button>
        </Link>
      </div>
    </>
  );
}
