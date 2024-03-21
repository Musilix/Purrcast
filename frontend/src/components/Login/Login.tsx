import { __supabase__ } from '@/constants';
import { AuthContext } from '@/context/AuthContext';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { useContext } from 'react';
import { Redirect } from 'wouter';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card';

export default function Login() {
  const { session } = useContext(AuthContext);

  return (
    <>
      {session && session.user ? (
        <Redirect to="/" />
      ) : (
        <section
          id="login-wrap"
          className="w-full sm:w-2/4 md:w-1/2 max-w-md px-10"
        >
          <Card>
            <CardHeader>
              <CardTitle>
                <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
                  Login to Purrcast
                </h1>
              </CardTitle>
            </CardHeader>

            <CardContent>
              <CardDescription>
                <p className="leading-7 [&:not(:first-child)]:mt-6">
                  In order to post, you'll have to make an account. Currently,
                  we only support creating an account with Google.
                </p>
              </CardDescription>
              <Auth
                supabaseClient={__supabase__}
                onlyThirdPartyProviders={true}
                providers={['google']}
                appearance={{ theme: ThemeSupa }}
              />
            </CardContent>
          </Card>
        </section>
      )}
    </>
  );
}
