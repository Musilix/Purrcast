import { AuthContext } from "@/context/AuthContext";
import { useContext } from "react";

export default function Loader({ children }: { children: React.ReactNode }) {
    const { isAuthLoading } = useContext(AuthContext);

    if (isAuthLoading)
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