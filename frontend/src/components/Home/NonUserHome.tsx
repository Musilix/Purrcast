import PostsPreview from '@/components/PostsPreview/PostsPreview';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';

export default function NonUserHome() {
  return (
    <>
      <main className="flex flex-col flex-auto place-items-center w-1/2 md:w-3/5 max-w-screen-lg space-y-10 *:p-5">
        <section id="splash-intro" className="w-full">
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl break-words">
            Welcome to {(import.meta.env.PROD) ? "Purrcast" : "Purrcast Test Feed"}!
          </h1>
          <p className="leading-7 [&:not(:first-child)]:mt-6 break-words">
            An old shriveled soothsayer once said:
          </p>
          <blockquote className="mt-6 border-l-2 pl-6 italic break-words">
            If your cat lays on it's head, there is rain up ahead.
          </blockquote>
          <p className="leading-7 [&:not(:first-child)]:mt-6 break-words">
            I took that very personally and so Purrcast was built to act as a centralized place for you to post and look at photos of peoples cats in your area to determine if it's going to rain soon or maybe just drizzle.
          </p>

          <div id="splash-buttons" className="flex flex-row justify-start w-full mt-8 space-x-4">
            {/* TODO: maybe make your buttons into a special class so you can extend the colors to use more than just hte primary and secondary color vars defined in the globals.css */}

            <Button className="p-6 text-lg">
              <Link href="/create-post">Post a Cat!</Link>
            </Button>

            <Button className="p-6 text-lg" variant={'secondary'}>
              <Link href="/faq">What Are You Talking About?</Link>
            </Button>

          </div>
        </section>

        <section id="splash-prev-posts" className="w-full">
          <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
            Posts being made by other users
          </h2>
          <PostsPreview />
        </section>
      </main>
    </>

  )
}