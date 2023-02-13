/* React Hooks */
import { useLayoutEffect } from "react";

/* Custom Hook */
export default function useScrollTop(dependency) {
    useLayoutEffect( () => {
        window.scrollTo({ "top": 0 })
    }, [dependency])
}