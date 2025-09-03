
import { anonymousSignIn } from "@/services/auth";
import { useEffect, useState } from "react";

export const useAuthCheck = () => {
    const [isFinished, setIsFinished] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            await anonymousSignIn();
            setIsFinished(true);
        };
        checkAuth();
    }, []);

    return { isFinished };
}
