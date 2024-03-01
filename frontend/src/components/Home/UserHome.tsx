// import PostsPreview from '@/components/PostsPreview/PostsPreview';
import { Session } from '@supabase/supabase-js';
import { Link } from 'wouter';


export default function UserHome({ session }: { session: Session }) {
  return (
    <>
      <main className="flex flex-col flex-auto w-1/4 md:w-3/5 max-w-screen-md space-y-10 *:p-5">
        <section id="splash-intro" className="flex flex-col w-full place-items-center place-content-center *:my-5">
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl break-words">
            Hey, {session.user?.user_metadata.name.split(" ")[0]}!
          </h1>
          {/* <h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">
            It's looking like it's gonna be a 100% chance of rain today in Corvallis, OR.
          </h2> */}

          <div className="flex flex-row w-3/4 place-items-center place-content-center *:p-2">
            <h1 className="scroll-m-20 font-extrabold tracking-tight text-emerald-400 sm:text-8xl md:text-9xl lg:text-9xl break-words">
              65%
            </h1>
            <h4 className="w-1/4 scroll-m-20 text-pretty text-lg text-muted-foreground font-semibold tracking-tight">
              Chance of rain today in Corvallis, OR.
            </h4>
          </div>



          <Link href='/faq#how-do-we-make-predictions'>
            <p className="text-sm text-muted-foreground cursor-pointer hover:text-foreground transition-all">Where are you getting this information?</p>
          </Link>

        </section>
        {/* 
        <section id="splash-prev-posts" className="w-full">
          <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
            Posts being made by other users
          </h2>
          <PostsPreview />
        </section> */}
      </main>
    </>

  )
}