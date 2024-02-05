import { __supabase__ } from "@/constants";
import { Session } from '@supabase/supabase-js';
import { createContext, useEffect, useState } from "react";


export const AuthContext = createContext<Session>({} as Session);

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session>({} as Session)

  useEffect(() => {
    __supabase__.auth.getSession().then(({ data: { session } }) => {
      (session) ? setSession(session) : '';
      console.log(`Session Data:`);
      console.log(session);
    })

    const {
      data: { subscription },
    } = __supabase__.auth.onAuthStateChange((_event, session) => {
      (session) ? setSession(session) : '';
    })

    return () => subscription.unsubscribe()
  }, [])

  return (
    <AuthContext.Provider value={session}>
      {children}
    </AuthContext.Provider>
  );
}