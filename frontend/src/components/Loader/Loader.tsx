import { AuthContext } from '@/context/AuthContext';
import { Loader2 } from 'lucide-react';
import { useContext } from 'react';

export default function Loader({ children }: { children: React.ReactNode }) {
  const { isAuthLoading } = useContext(AuthContext);

  if (isAuthLoading)
    return (
      <div className="h-dvh w-1/2 flex flex-col place-content-center place-items-center">
        <Loader2
          size={50}
          color={'hsl(var(--primary))'}
          className="animate-spin"
        />
      </div>
    );
  else return <>{children}</>;
}
