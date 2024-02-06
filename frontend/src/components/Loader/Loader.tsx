import { AuthContext } from "@/context/AuthContext";
import { Session } from "@supabase/supabase-js";
import { useContext, useEffect, useState } from "react";

export default function Loader({ children }: { children: React.ReactNode }) {
    const [isLoading, setIsLoading] = useState(true);
    const session = useContext(AuthContext);

    useEffect(() => {
        const intialLoad = async () => {
            await new Promise((res) => {
                // This is a complicated matter and probably a result of my lack of understanding 
                // We know supabase will return null for a session if none exists, but we also know we set the default for sesssion
                // to be {} while we wait for supabase to give us the real value. SO this means that we can continuosly check until we have
                // a value other than the default, where we will then break the loop and load the page...
                while (session === {} as Session) {
                    continue;
                }

                res(true);
            });

            setIsLoading(false);
        }

        intialLoad();

    }, [session]);

    if (isLoading)
        return (
            <div className="h-dvh w-1/2 flex flex-col place-content-center place-items-center">
                <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">Loading...</h1>
            </div>
        )
    else
        return (
            <>
                {children}
            </>
        )
}