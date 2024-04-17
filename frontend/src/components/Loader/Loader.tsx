import { AuthContext } from '@/context/AuthContext';
import { ContentLoadingContext } from '@/context/ContentLoadingContext';
import { Loader2 } from 'lucide-react';
import { useContext } from 'react';

export default function Loader({ children }: { children: React.ReactNode }) {
  const { isAuthLoading } = useContext(AuthContext);
  const { isContentLoading } = useContext(ContentLoadingContext);

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
  else
    return (
      <>
        {isContentLoading ? (
          <div className="bg-black/50  absolute left-0 top-0 h-full w-full flex flex-col items-center justify-center align-middle z-10 ">
            <Loader2
              size={50}
              color={'hsl(var(--primary))'}
              className="animate-spin"
            />
          </div>
        ) : (
          ''
        )}

        {children}
      </>
    );
}
