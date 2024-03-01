import { AuthContext } from "@/context/AuthContext";
import { User } from "@supabase/supabase-js";
import { useContext } from "react";
import { Redirect } from "wouter";
import PostsPreview from "../PostsPreview/PostsPreview";
import { Button } from "../ui/button";

export default function Profile() {
  const { session } = useContext(AuthContext);

  return (
    <>
      <section id="profile-wrap" className="w-5/6 sm:w-5/6 md:w-4/5 max-w-screen-md *:my-10">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">Your Profile</h1>
        {
          (session && session.user) ?
            <>
              <div className="grid grid-rows-5 grid-flow-row gap-5">
                <div className="row-span-2">
                  <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight">Profile Picture:</h2>
                  <img className="size-[150px] rounded-md" src={((session.user as User).user_metadata.picture).split("=")[0] + "=s150-c"} alt=" Profile Picture" />
                </div>
                <div >
                  <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight">Email:</h2>
                  <p className="leading-7 [&:not(:first-child)]:mt-2">{session.user.email}</p>
                </div>
                <div>
                  <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight">Name:</h2>
                  <p className="leading-7 [&:not(:first-child)]:mt-2">{(session.user as User).user_metadata.full_name}</p>
                </div>
                <div>
                  <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight">Posts:</h2>
                  <p className="leading-7 [&:not(:first-child)]:mt-2">
                    0
                  </p>
                </div>
              </div>

              {/* TODO - we need to make it so we can specify filtering properties when displaying a post preview bundle */}
              <PostsPreview className="p-0" />
              <div id="button-wrap">
                <Button variant="destructive">Delete Account</Button>
              </div>
            </>
            :
            <Redirect to="/login" />
        }
      </section>
    </>
  )
}