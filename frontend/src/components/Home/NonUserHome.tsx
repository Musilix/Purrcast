import { Button } from '@/components/ui/button';
import { ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'wouter';
import { Card } from '../ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

export default function NonUserHome() {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  return (
    <>
      <div>
        <h1 className="text-center font-bold leading-tight tracking-tighter text-5xl md:text-6xl lg:leading-[1.1] md:block">
          {import.meta.env.PROD ? 'Purrcast' : 'Purrcast Test Feed'}
        </h1>

        <p className="max-w-[750px] text-center text-md md:text-lg text-muted-foreground sm:text-xl !my-0">
          The weather app made by cats.
        </p>
      </div>
      <div
        id="splash-intro-wrap"
        className="relative !my-5 p-5 flex flex-col justify-center items-center *:transition-all *:duration-500 *:ease-in-out"
      >
        <img
          src="/purrcaster-home-temp.png"
          className={`${
            isImageLoaded
              ? 'opacity-1 -mb-[10px] h-auto'
              : 'opacity-0 -mb-[225px] h-[0px]'
          } -z-10 w-3/4 min-w-[100px] max-w-3/4 `}
          onLoad={() => {
            setIsImageLoaded(true);
          }}
          loading="lazy"
        />

        <Card className="z-10 w-full md:w-full p-6 m-t-[200px] max-w-[500px] min-w-[300px] text-center">
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
        className="flex flex-row justify-center align-middle w-full mt-4 mx-0 "
      >
        {/* TODO - make the dom element structure a bit... cleaner? */}
        <div>
          <Link href="/create-post">
            <Button
              className="p-6 text-lg rounded-l-full"
              variant="supabasianPrimary"
            >
              Post a Cat
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

        {/* <div>
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
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  {' '}
                  <Link href="/faq">
                    <Button
                      className="p-3 w-full"
                      variant="supabasianSecondary"
                    >
                      I'm Confused
                    </Button>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div> */}
      </div>
    </>
  );
}
