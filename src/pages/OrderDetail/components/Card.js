/* import */
/* ======================================== */
/* CSS */
import style from "./Card.module.css"
/* API */
import API from "../../../API"
/* Hooks */
import { useState, useEffect, useRef } from "react"

/* ======================================== */
export default function Card({ element, noBorder }) {
    const {name, cover, price, amount} = element
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
        <div className={style.card} style={noBorder? {border:"0"}: {}}>
            <div className={`link ${style.name}`}>{name}</div>
            <div className={`link ${style.img}`}>
                {!loaded && <div className="fill skeleton" />}
                <img
                    ref={imgRef}
                    style={{opacity:loaded?1:0}} loading="eager" alt=""
                    src={`${API.WS_URL}/${cover}`}
                />
            </div>
            <div className={style.price}>NT${price}</div>
            <div className={style.number}>×{amount}</div>
        </div>
    </>
}
