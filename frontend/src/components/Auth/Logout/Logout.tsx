// import { Button } from "@/components/ui/button";
import { __supabase__ } from '@/constants';
import useGeo from '@/hooks/useGeo';
import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { useToast } from '../../ui/use-toast';

export default function Logout() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [, , , , clearAllGeoCoords] = useGeo();

  useEffect(() => {
    const logout = async () => {
      await __supabase__.auth
        .signOut({ scope: 'local' })
        .then(() => clearAllGeoCoords())
        .catch((err) => {
          toast({
            description:
              "There was an issue while trying to sign you out for some reason. That's strange. Maybe try refreshing the page?",
            variant: 'destructive',
          });
          console.error('Error signing out:', err, '. Try again.');
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
