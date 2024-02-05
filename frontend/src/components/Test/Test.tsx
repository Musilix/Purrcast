// import { Button } from "@/components/ui/button";
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { Session, createClient } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';

const supabase = createClient('https://ftfnpcakwxryjnacwiid.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ0Zm5wY2Frd3hyeWpuYWN3aWlkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDIwNzQwMjEsImV4cCI6MjAxNzY1MDAyMX0.hqDbxDFgdqlow-ijuENEk9IXOypWDxRtpMTtW-7-fto')

export default function Test() {
  const [session, setSession] = useState<Session | null>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      console.log(`Session Data:`);
      console.log(session);
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (!session) {
    return (<Auth supabaseClient={supabase} onlyThirdPartyProviders={true} providers={['google']} appearance={{ theme: ThemeSupa }} />)
  }
  else {
    return (<div>Logged in!</div>)
  }
}