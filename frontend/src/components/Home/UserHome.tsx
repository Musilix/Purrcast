// import PostsPreview from '@/components/PostsPreview/PostsPreview';
import { Session } from '@supabase/supabase-js';
import { Link } from 'wouter';
import { Button } from '../ui/button';


export default function UserHome({ session }: { session: Session }) {
  return (
    <>
      <main className="flex flex-col flex-auto justify-center align-center place-items-center w-1/4 md:w-3/5 max-w-screen-md space-y-10 *:p-5">
        <section id="splash-intro" className="flex flex-col w-full place-items-center place-content-center *:my-5">
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl break-words text-center">
            {
              (new Date().getHours() >= 5 && new Date().getHours() < 12) ? "Good morning" :
                (new Date().getHours() >= 12 && new Date().getHours() < 18) ? "Good afternoon" :
                  "Good evening"
            }
            {`, ${session.user?.user_metadata.name.split(" ")[0]}`}
          </h1>

          <div className="flex flex-col sm:flex-col md:flex-row w-3/4 place-items-center place-content-center *:p-2">
            <h1 className="scroll-m-20 font-extrabold tracking-tight text-emerald-400 text-8xl sm:text-6xl md:text-9xl break-words">
              65%
            </h1>
            <h4 className="w-3/4 sm:w-3/4 md:w-1/4 scroll-m-20 text-pretty text-lg text-muted-foreground font-semibold tracking-tight">
              Chance of rain today in Corvallis, OR.
            </h4>
          </div>



          <Link href='/faq#how-do-we-make-predictions'>
            <p className="text-sm text-muted-foreground cursor-pointer hover:text-foreground transition-all">Where are you getting this information?</p>
          </Link>

        </section>
        <section id="cta-wrap" className="flex flex-row w-full align-center place-items-center place-content-center my-0 mt-0 *:m-5">
          <div>
            <Link href="/posts">
              <Button className="p-6 text-lg">See Posts Near You</Button>
            </Link>
          </div>
          <div>
            <Link href="/create-post">
              <Button className="p-6 text-lg">Post a Cat!</Button>
            </Link>
          </div>
        </section>
      </main>
    </>

  )
}