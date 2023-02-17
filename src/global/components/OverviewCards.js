/* CSS */
import style from "./OverviewCards.module.css"

/* React Hooks */
import { Link } from "react-router-dom"

function ProductCard({ link, name, price, showHeart }) {
    return <>
        <div className={style.product_card} >
            <Link to="/Product/1">
                <div className={style.img}>
                    <img src={link} alt="" />
                </div>
                <div className={style.name}>{name}</div>
                <div className={style.price}>NT$ {price} / 每天</div>
            </Link>
            <button className={`${style.heart} ${showHeart? "": style.none}`}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-heart-fill" viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"/>
                </svg>
            </button>
        </div>
    </>
}

function OverviewCards({ children }) {
    return <div className={style.products_area}>
        {children}
    </div>
}

OverviewCards.ProductCard = ProductCard
export default OverviewCards