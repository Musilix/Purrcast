import { useEffect, useState } from 'react';

function getLocalStorageValue(
  key: string,
  initialValue: string | number | object | boolean | null = null,
) {
  const savedValue = JSON.parse(localStorage.getItem(key) ?? '{}');

  if (savedValue) {
    return savedValue;
  }

  return initialValue;
}

export default function useLocalStorage(
  key: string,
  initialValue: string | number | object | boolean | null = null,
) {
  const [value, setValue] = useState(() => {
    return getLocalStorageValue(key, initialValue);
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [value]);

  return [value, setValue];
}
