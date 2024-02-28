import PostsPreview from '@/components/PostsPreview/PostsPreview';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { Card } from '../ui/card';

export default function NonUserHome() {
  return (
    <>
      <section id="splash-intro" className="w-full h-full text-center flex flex-col flex-grow justify-center place-items-center *:m-2.5">
        <h1 className="text-center font-bold leading-tight tracking-tighter text-5xl md:text-6xl lg:leading-[1.1] md:block">
          {(import.meta.env.PROD) ? "Purrcast" : "Purrcast Test Feed"}
        </h1>

        <p className="max-w-[750px] text-center text-md md:text-lg text-muted-foreground sm:text-xl !my-0">
          The weather app made by cats.
        </p>

        <div className='relative flex flex-row items-center justify-center w-full !my-5 !mt-[150px] p-10 '>
          <Card className="w-5/6 md:w-full p-6 max-w-[600px] min-w-[300px] z-10">
            <p className='text-lg font-semibold'>
              An old soothsayer once said
            </p>
            <p className='text-sm text-muted-foreground'>
              If your cat lays on it's head, there is rain up ahead.
            </p>
            <p className="leading-7 [&:not(:first-child)]:mt-6 break-keep">
              I took that very personally and so Purrcast was built to act as a centralized place for you to post and look at photos of peoples cats in your area to determine if it's going to rain soon or maybe just drizzle.
            </p>
          </Card>

          <img src='/purrcaster-home.png' className='absolute bottom-1/4 left-1/4 sm:left-1/2 md:bottom-1/6 min-w-[300px] max-w-[300px] -z-1 transition-all' />
          <img src='/purrcaster-home.png' className='absolute bottom-1/4 right-1/4 sm:right-1/2 md:bottom-1/6 min-w-[300px] max-w-[300px] -z-1 transition-all' />
        </div>


        <div id="splash-buttons" className="flex flex-col md:flex-row lg:flex-row justify-center align-middle w-5/6 sm:w-3/4 md:w-full  mt-8 space-x-0 space-y-4 md:space-x-4 md:space-y-0 lg:space-x-4 lg:space-y-0 ">
          <Link href="/create-post">
            <Button className="p-6 text-lg">Post a Cat!</Button>
          </Link>

          <Link href="/faq">
            <Button className="p-6 text-lg" variant={'secondary'}>What Are You Talking About?</Button>
          </Link>
        </div>
      </section>

      {/* <section id="splash-prev-posts" className="w-full">
        <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
          Posts being made by other users
        </h2>
        <PostsPreview />
      </section> */}
    </>

  )
}