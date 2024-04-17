import { createContext, useEffect, useState } from 'react';

interface ContentLoadingContextValues {
  isContentLoading: boolean;
  setIsContentLoading: (value: boolean) => void;
}

export const ContentLoadingContext = createContext<ContentLoadingContextValues>(
  {} as ContentLoadingContextValues,
);

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
    <ContentLoadingContext.Provider
      value={{ isContentLoading, setIsContentLoading }}
    >
      {children}
    </ContentLoadingContext.Provider>
  );
}
