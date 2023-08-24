/* import */
/* ======================================== */
/* API */
import API from "../../../API"
/* CSS */
import style from "./Card.module.css"
/* Hooks */
import { useState, useEffect, useRef } from "react"
import { Link } from "react-router-dom"

/* ======================================== */
export default function Card({ element }) {
    const {order_id, cover, nickname, totalprice, items} = element
    if (items?.length > 2) items.length = 2
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
        <Link className={`link ${style.card}`} to={`/OrderDetail/${order_id}`}>
            <div className={style.img}>
                {!loaded && <div className="fill skeleton" />}
                <img
                    ref={imgRef}
                    style={{opacity:loaded?1:0}} loading="eager" alt=""
                    src={`${API.WS_URL}/${cover}`}
                />
            </div>
            <div className={style.name}>{nickname}</div>
            <div className={style.price}>$NT{totalprice} / 天</div>
            <div className={style.items}>
                {items?.map((name, i) => <div key={i}>- {name}</div>)}
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
            <div className={style.name}>
                <div className="fill skeleton" style={{height:"20px", width:"60%"}} />
            </div>
            <div className={style.price}>
                <div className="fill skeleton" style={{height:"20px", width:"60%"}} />
            </div>
            <div className={style.items}>
                <div className="fill skeleton" style={{height:"15px", width:"80%"}} />
                <div className="fill skeleton" style={{height:"15px", width:"80%", marginTop:"5px"}} />
            </div>
        </div>
    </>
}
