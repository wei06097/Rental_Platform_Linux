/* CSS */
import style from "./Card.module.css"
import API from "../../../API"
/* Hooks */
import { useState, useEffect, useRef } from "react"
import { Link } from "react-router-dom"

/* ======================================== */
export default function Card({ account, data }) {
    const {nickname, cover, items} = data
    if (items?.length > 4) items.length = 4
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
                            ?.map((item, i) => 
                                <div key={i}>
                                    <span>- </span>
                                    <span>{item}</span>
                                </div>
                            )
                    }
                </div>
            </div>
        </Link>
    </>
}

export function LoadingCard() {
    return <>
        <div className={style.card}>
            <div className={style.img}>
                <div className="fill skeleton" />
            </div>
            <div className={style.store}>
                <div className="fill skeleton" style={{height:"20px", width:"60%"}} />
            </div>
            <div className={style.items}>
                <div className="fill skeleton" style={{height:"15px", width:"80%"}} />
                <div className="fill skeleton" style={{height:"15px", width:"80%", marginTop:"5px"}} />
                <div className="fill skeleton" style={{height:"15px", width:"80%", marginTop:"5px"}} />
                <div className="fill skeleton" style={{height:"15px", width:"80%", marginTop:"5px"}} />
            </div>
        </div>
    </>
}
