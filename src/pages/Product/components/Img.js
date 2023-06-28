/* import */
/* ======================================== */
/* CSS */
import style from "./ImgCard.module.css"
/* Hooks */
import { useState, useEffect, useRef } from "react"

/* ======================================== */
export default function Img({src, openhandler}) {
    const [loaded, setLoaded] = useState(false)
    const imgRef = useRef()

    useEffect(() => {
        const imgElement = imgRef.current
        const loaded = () => setLoaded(true)
        imgElement.addEventListener("load", loaded)
        if (imgElement.complete) setLoaded(true)
        return () => {
            imgElement.removeEventListener("load", loaded)
        }
    }, [])
    
    /* ==================== 分隔線 ==================== */
    return <>
        <label className={style.img} htmlFor="img">
            {!loaded && <div className="fill skeleton" />}
            <img
                ref={imgRef}
                style={{opacity:loaded?1:0}} loading="eager" alt=""
                src={src} name="img" onClick={openhandler}
            />
        </label>
    </>
}