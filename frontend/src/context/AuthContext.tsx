import { useToast } from '@/components/ui/use-toast';
import { __supabase__ } from '@/constants';
import { Session } from '@supabase/supabase-js';
import { createContext, useEffect, useState } from 'react';

interface AuthContextValues {
  session: Session | null;
  isAuthLoading: boolean;
  isAuthError: boolean;
}
export const AuthContext = createContext<AuthContextValues>(
  {} as AuthContextValues,
);

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [session, setSession] = useState<Session | null>(null);
  const { toast } = useToast();
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  // TODO - this isn't really used anywhere, so it can probably be removed at some point
  const [isAuthError, setIsAuthError] = useState(false);

  useEffect(() => {
    // If for some reason the auth loading state is not set, set it to true on auth provider mount
    !isAuthLoading ? setIsAuthLoading(true) : '';

    __supabase__.auth
      .getSession()
      .then(({ data: { session }, error }) => {
        // Check for an error and throw accordingly or set session with retrieved data
        if (error) {
          throw new Error(
            'Session was unable to be loaded due to an issue on the server.',
          );
        } else {
          setSession(session);
        }

        // Do a final check after session was set to make sure the session object and the session.user object are both set
        if (session && session.user) {
          setIsAuthLoading(false);
        }
        // else {
        //   throw new Error('No session found.');
        // }
      })
      .catch((e) => {
        toast({
          title: 'There was an issue with your account',
          description: e.message,
          variant: 'destructive',
        });
        setIsAuthError(true);
        setIsAuthLoading(false);
      });

    // Upon change of auth state, set loading to true, update the session, and then set loading to false thereafter just to make sure no strange behavior occurs during the session set phase
    const {
      data: { subscription },
    } = __supabase__.auth.onAuthStateChange((_event, session) => {
      setIsAuthLoading(true);
      setSession(session);
      setIsAuthLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ session, isAuthLoading, isAuthError }}>
      {children}
    </AuthContext.Provider>
  );
}
