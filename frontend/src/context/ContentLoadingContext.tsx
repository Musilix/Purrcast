import { Loader } from 'lucide-react';
import { createContext, useState } from 'react';

interface ContentLoadingContextValues {
  isContentLoading: boolean | null;
  setIsContentLoading: (value: boolean | null) => void;
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
  const [isContentLoading, setIsContentLoading] =
    useState<ContentLoadingContextValues['isContentLoading']>(null);

  return (
    <>
      <ContentLoadingContext.Provider
        value={{
          isContentLoading,
          setIsContentLoading,
        }}
      >
        <div
          className={`h-full w-full ${
            isContentLoading ? 'overflow-hidden' : ''
          }`}
        >
          {isContentLoading ? (
            <div className="absolute z-40 bg-background left-0 top-0 !m-0 w-full h-full flex flex-col items-center justify-center align-middle">
              <Loader
                size={50}
                color={'hsl(var(--primary))'}
                className="animate-spin"
              />
            </div>
          ) : (
            ''
          )}
          {children}
        </div>
      </ContentLoadingContext.Provider>
    </>
  );
}
