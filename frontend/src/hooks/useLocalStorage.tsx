import { useEffect, useState } from 'react';

function getLocalStorageValue<T>(key: string, initialValue: T | null = null) {
  // In the case that the item isn't in local storage, we'll want to return null.
  // For some reason, TS doesnt want us to just return null, so we have to return the string 'null'
  const savedValue = JSON.parse(localStorage.getItem(key) ?? 'null');

  if (savedValue) {
    return savedValue;
  }

  return initialValue;
}

export default function useLocalStorage<T>(
  key: string,
  initialValue: T | null = null,
) {
  const [value, setValue] = useState(() => {
    return getLocalStorageValue<T>(key, initialValue);
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [value]);

  return [value, setValue];
}
