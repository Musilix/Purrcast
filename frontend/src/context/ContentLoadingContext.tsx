import { Loader } from 'lucide-react';
import { createContext, useEffect, useState } from 'react';

interface ContentLoadingContextValues {
  isContentLoading: boolean;
  setIsContentLoading: (value: boolean) => void;
}

export const ContentLoadingContext = createContext<ContentLoadingContextValues>(
  {} as ContentLoadingContextValues,
);

// I have a lot of confusing things currently going on when it comes to loaders.
// I have both a Loader component and a ContentLoadingProvider, but the Loader component only relies on the isAuthLoading state from the AuthProvider.
// TODO - I think I need to remove that Loader component and store the logic for showing a loader similar to how I'm doing below for content-specific loading
export default function ContentLoadingProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isContentLoading, setIsContentLoading] = useState(true);

  useEffect(() => {
    // If for some reason the auth loading state is not set, set it to true on auth provider mount
    !isContentLoading ? setIsContentLoading(true) : '';
  }, []);

  return (
    <>
      <ContentLoadingContext.Provider
        value={{
          isContentLoading,
          setIsContentLoading,
        }}
      >
        {isContentLoading ? (
          <div className="m-0">
            <div className="absolute left-0 top-0 bg-black w-full h-full flex flex-col items-center justify-center align-middle z-10">
              <Loader
                size={50}
                color={'hsl(var(--primary))'}
                className="animate-spin"
              />
            </div>
          </div>
        ) : (
          ''
        )}
        {children}
      </ContentLoadingContext.Provider>
    </>
  );
}
