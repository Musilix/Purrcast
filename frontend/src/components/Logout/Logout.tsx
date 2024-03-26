// import { Button } from "@/components/ui/button";
import { __supabase__ } from '@/constants';
import { useEffect } from 'react';
import { useLocation } from 'wouter';

export default function Logout() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    const logout = async () => {
      await __supabase__.auth
        .signOut({ scope: 'local' })
        .then()
        .catch((error) => {
          console.error('Error signing out:', error, '. Try again.');
        });

      setLocation('/');
    };

    logout();
  }, []);

  return (
    <>
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
        Logging out...
      </h1>
    </>
  );
}
