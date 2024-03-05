import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { Card } from '../ui/card';

export default function NonUserHome() {
  return (
    <>
      <section id="splash-intro" className="w-full  text-center flex flex-col flex-grow justify-center place-items-center *:m-2.5">
        <h1 className="text-center font-bold leading-tight tracking-tighter text-5xl md:text-6xl lg:leading-[1.1] md:block">
          {(import.meta.env.PROD) ? "Purrcast" : "Purrcast Test Feed"}
        </h1>

        <p className="max-w-[750px] text-center text-md md:text-lg text-muted-foreground sm:text-xl !my-0">
          The weather app made by cats.
        </p>

        <div className='!my-5 p-5'>
          <div className='w-full flex justify-center align-middle animate-spin p-2.5'>
            <img src='/purrcaster-home.png' className=' top-50 w-3/4 min-w-[100px] max-w-[250px]' />
          </div>

          <Card className="w-full md:w-full p-6 max-w-[500px] min-w-[300px] mt-2.5">
            {/* create an absolute positioned triangle div that makes it's parent div look like a speech bubble */}
            {/* <div className='absolute -bottom-6 left-2 w-[25px] h-[25px] border-solid border-b-slate-400  border-r-slate-400 border-opacity-0 border-8'></div> */}

            <p className='text-lg font-semibold'>
              An old soothsayer once said
            </p>
            <p className='text-sm text-muted-foreground'>
              When your cats head is low, the clouds are soon to grow.
            </p>
            <p className="leading-7 [&:not(:first-child)]:mt-6 break-keep">
              I took that very personally and so Purrcast was built to act as a centralized place for you to post and look at photos of peoples cats in your area to determine if it's going to rain soon or maybe just drizzle.
            </p>
          </Card>
        </div>


        <div id="splash-buttons" className="flex flex-col md:flex-row lg:flex-row justify-center align-middle w-5/6 sm:w-3/4 md:w-full  mt-8 space-x-0 space-y-4 md:space-x-4 md:space-y-0 lg:space-x-4 lg:space-y-0 ">
          <Link href="/create-post">
            <Button className="p-6 text-lg" variant={'supabasianPrimary'}>Post a Cat</Button>
          </Link>

          <Link href="/faq">
            <Button className="p-6 text-lg" variant={'supabasianSecondary'}>I'm Confused</Button>
          </Link>
        </div>
      </section>
    </>
  )
}