import { __supabase__ } from "@/constants";
import { AuthContext } from "@/context/AuthContext";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useContext } from "react";
import { Redirect } from "wouter";

export default function Login() {
  const session = useContext(AuthContext);

  //do some supabase oauth stuff
  return (
    <>
      (session) ? <Redirect to="/" /> :
      <div className="w-2/6 max-w-1/2">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
          Login to Purrcast
        </h1>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          In order to post, you'll have to make an account. Currently, we only support creating an account with Google.
        </p>
        <Auth supabaseClient={__supabase__} onlyThirdPartyProviders={true} providers={['google']} appearance={{ theme: ThemeSupa }} />
      </div>
    </>
  )
}