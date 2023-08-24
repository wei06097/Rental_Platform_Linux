/* import */
/* ======================================== */
import style from "./Message.module.css"
/* Hooks */
import { useEffect } from "react"

/* ======================================== */
export default function ViewPage({ closePage, src }) {
    useEffect(() => {
        document.body.style.overflow = "hidden"
        return () => {
            document.body.style.overflow = "auto"
        }
    }, [])
    /* ==================== 分隔線 ==================== */
    return <>
        <div className={`page ${style.viwe}`}>
            <img src={src} alt="" onClick={closePage} />
        </div>
    </>
}
