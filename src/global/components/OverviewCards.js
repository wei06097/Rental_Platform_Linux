/* import */
/* CSS */
import style from "./OverviewCards.module.css"
/* Hooks */
import { useState, useEffect, useRef } from "react"
import { Link } from "react-router-dom"

/* ======================================== */
function ProductCard({ id, link, name, price, showHeart }) {
    const [loaded, setLoaded] = useState(false)
    const imgRef = useRef()
    useEffect(() => {
        const imgElement = imgRef.current
        const loaded = () => setLoaded(true)
        imgElement.addEventListener("load", loaded)
        return () => {
            imgElement.removeEventListener("load", loaded)
        }
    }, [])

    /* ==================== 分隔線 ==================== */
    return <>
        <div className={style.product_card} >
            <Link className="link" to={`/Product/${id}`}>
                <div className={style.img}>
                    {!loaded && <div className="fill skeleton" />}
                    <img style={{opacity:loaded?1:0}}
                        src={link} alt="" ref={imgRef}
                    />
                </div>
                <div className={style.info}>
                    <div>{name}</div>
                    <div>{`NT$${price} / 每天`}</div>
                </div>
            </Link>
            <button className={`${style.heart}`} style={{display:showHeart?"block":"none"}}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-heart-fill" viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"/>
                </svg>
            </button>
        </div>
    </>
}
function OverviewCards({ children }) {
    return <>
        <div className={style.products_area}>
            {children}
        </div>
    </>
}

OverviewCards.ProductCard = ProductCard
export default OverviewCards
