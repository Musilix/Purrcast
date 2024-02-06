import { __supabase__ } from "@/constants";
import { Session } from '@supabase/supabase-js';
import { createContext, useEffect, useState } from "react";


export const AuthContext = createContext<Session>({} as Session);

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session>({} as Session)

  useEffect(() => {
    __supabase__.auth.getSession().then(({ data: { session }, error }) => {
      if (error) throw error;
      (session) ? setSession(session) : '';
    }).catch((error) => {
      console.error(`Error fetching session: ${error}`);
    });

    const {
      data: { subscription },
    } = __supabase__.auth.onAuthStateChange((_event, session) => {
      setSession(session ?? {} as Session);
    })

    return () => subscription.unsubscribe()
  }, [])

  return (
    <AuthContext.Provider value={session}>
      {children}
    </AuthContext.Provider>
  );
}