/* CSS */
import style from "./CartCards.module.css"

/* Components */
import Number from "./Number"

/* React Hooks */
import { Link } from "react-router-dom"

/* React Components */
function ProductCard({ product }) {
    return <>
        <div className={style.product_card}>
            <input type="checkbox" className={style.checkbox} />
            <Link className={style.img} to="/Product">
                <img src={product?.img || ""} alt="" />
            </Link>
            <div className={style.info}>
                <Link className={style.name} to="/Product">{product?.name || ""}</Link>
                <div className={style.price}>NT$ {product?.price || ""} / 每天</div>
                <Number />
                <button className={`button ${style.delete}`}>刪除</button>
            </div>
        </div>
    </>
}

function CartCards({ children }) {
    return <>
        {children}
    </>
}

CartCards.ProductCard = ProductCard
export default CartCards