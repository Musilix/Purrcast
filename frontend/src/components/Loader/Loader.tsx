import { AuthContext } from "@/context/AuthContext";
import { useContext, useEffect, useState } from "react";

export default function Loader({ children }: { children: React.ReactNode }) {
    const [isLoading, setIsLoading] = useState(true);
    const session = useContext(AuthContext);

    useEffect(() => {
        if (session && session.user) {
            setIsLoading(false); // Set isLoading to false once session is available
        } else {
            setIsLoading(false); // Set isLoading to false once session is available
        }

    }, [session]);

    return (
        <>
            {
                isLoading ?
                    <h1>Loading...</h1> :
                    <div>
                        {children}
                    </div>
            }
        </>

    )

}