import { ChangeEvent } from "preact/compat";
import { useState } from "preact/hooks";

type OnInputChangeHook = [string, (e: ChangeEvent<HTMLInputElement>) => void];

export default function useInputState(initialValue: string): OnInputChangeHook {
  let [value, setValue] = useState<string>(initialValue);

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue((e.target as HTMLInputElement).value);
  }
  return [value, onChange];
}