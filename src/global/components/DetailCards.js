/* CSS */
import style from "./DetailCards.module.css"

/* React Hooks */
import { Link } from "react-router-dom"

/* React Components */
function ProductCard({ product }) {
    return <>
        <div className={style.product_card}>
            <Link className={style.img} to="/Product">
                <img src="https://cf.shopee.tw/file/7547aa6b546059505722d474287b8371" alt="" />
            </Link>
            <div className={style.info}>
                <Link className={style.name} to="/Product">名稱</Link>
                <div className={style.price}>NT$ 100 / 每天</div>
                <div className={style.amount}>x 150</div>
            </div>
        </div>
    </>
}

function DetailCards({ children }) {
    return <>
        <div className={style.cards}>
            {children}
            <div className={style.total}>
                <div>
                    <span>租借天數</span>
                    <span>5 天</span>
                </div>
                <div>
                    <span>訂單金額</span>
                    <span>NT$ 1500</span>
                </div>
            </div>
        </div>
    </>
}

DetailCards.ProductCard = ProductCard
export default DetailCards