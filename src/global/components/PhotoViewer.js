/* CSS */
import style from "./PhotoViewer.module.css"

/* React Hooks */
import { useEffect } from "react"

/* React Components */
export default function PhotoViewer({ fullscreen, setFullscreen }) {
    useEffect( () => {
        if (fullscreen === "") document.body.style.overflowY = "scroll"
        else document.body.style.overflowY = "hidden"
    }, [fullscreen])
    return (
        (fullscreen !== "")
        ? <div className={style.mask}>
            <button className={style.close} onClick={ ()=>{setFullscreen("")} } >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x" viewBox="0 0 16 16">
                    <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                </svg>
            </button>
            <div className={style.img}>
                <img src={fullscreen} alt="" />
            </div>
        </div>
        : <></>
    )
}