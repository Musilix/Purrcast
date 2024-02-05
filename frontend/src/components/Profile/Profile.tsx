import { AuthContext } from "@/context/AuthContext";
import { User } from "@supabase/supabase-js";
import { useContext } from "react";
import { Button } from "../ui/button";

export default function Profile() {
  const session = useContext(AuthContext);

  return (
    <>
      <div id="profile-wrap" className="w-1/2 p-5 *:my-10">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">Your Profile</h1>
        {
          (session && session.user) ?
            <>
              <div className="grid grid-rows-5 md:grid-rows-3 lg:grid-rows-4 grid-flow-row gap-5">
                <div className="row-span-2">
                  <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight">Profile Picture:</h2>
                  <img className="size-[150px]" src={(session.user as User).user_metadata.avatar_url} alt=" Profile Picture" />
                </div>
                <div >
                  <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight">Email:</h2>
                  <p className="leading-7 [&:not(:first-child)]:mt-6">{session.user.email}</p>
                </div>
                <div>
                  <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight">Name:</h2>
                  <p className="leading-7 [&:not(:first-child)]:mt-6">{(session.user as User).user_metadata.full_name}</p>
                </div>

                <div>
                  <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight">Posts:</h2>
                  <p className="leading-7 [&:not(:first-child)]:mt-6">0</p>
                </div>
              </div>
              <div id="button-wrap">
                <Button variant="destructive">Delete Account</Button>
              </div>
            </>
            :
            <h2>Not Logged In</h2>
        }
      </div>
    </>
  )
}