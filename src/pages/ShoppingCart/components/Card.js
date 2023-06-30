/* CSS */
import style from "./Card.module.css"
import API from "../../../API"
/* Hooks */
import { useState, useEffect, useRef } from "react"
import { Link } from "react-router-dom"

/* ======================================== */
export default function Card({ account, data }) {
    const {nickname, cover, items} = data
    const [loaded, setLoaded] = useState(false)
    const imgRef = useRef()

    if (items.length > 3) {
        items.length = 4
        items[3] = "......"
    }
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
        <Link className="link" to={`/Bill/${account}`}>
            <div className={style.card}>
                <div className={style.img}>
                    {!loaded && <div className="fill skeleton" />}
                    <img
                        ref={imgRef}
                        style={{opacity:loaded?1:0}} loading="eager" alt=""
                        src={`${API.WS_URL}/${cover}`}
                    />
                </div>
                <div className={style.store}>
                    {nickname}
                </div>
                <div className={style.items}>
                    {
                        items
                            .map((item, i) => 
                                <div key={i}>
                                    <span>*</span>
                                    <span>{item}</span>
                                </div>
                            )
                    }
                </div>
            </div>
        </Link>
    </>
}
