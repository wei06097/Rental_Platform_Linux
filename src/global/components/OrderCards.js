/* CSS */
import style from "./OrderCards.module.css"

/* React Hooks */
import { Link } from "react-router-dom"

/* Functions */

/* React Components */
function ProductCard({state, isClient, product, amount}) {
    return <>
        <Link to="/OrderDetail">
            <div className={style.img}>
                <img src={product?.img || ""} alt="" />
            </div>
            <div className={style.name}>{product?.name || ""}</div>
        </Link>
        <div className={style.detail}>
            <div>
                <span>{amount} 商品</span>
            </div>
            <div>
                <div>
                    <span>租借天數</span>
                    <span>5 天</span>
                </div>
                <div>
                    <span>訂單金額</span>
                    <span>NT$ {product?.price || ""}</span>
                </div>
            </div>
        </div>
        {
            isClient
            ? <ClientButtons state={state} />
            : <SellerButtons state={state} />
        }
    </>
}

/* ======================================== */
function ClientButtons({ state }) {
    switch (state) {
        case 1:
            return <div className={style.btns}>
                <button className="button">取消訂單</button>
            </div>
        case 2:
            return <div className={style.btns}>
                <button className="button">取消訂單</button>
                <button className="button">已收貨</button>
            </div>
        default:
            return <></>
    }
}
function SellerButtons({ state }) {
    switch (state) {
        case 1:
            return <div className={style.btns}>
                <button className="button">取消訂單</button>
                <button className="button">確認訂單</button>
            </div>
        case 2:
            return <div className={style.btns}>
                <button className="button">取消訂單</button>
            </div>
        case 3:
            return <div className={style.btns}>
                <button className="button">已歸還</button>
            </div>  
        default:
            return <></>
    }
}

/* ======================================== */
function OrderCards({ children, provider}) {
    return <>
        <div className={style.store}>
            <div>{provider}</div>
            <div className={style.product}>
                {children}
            </div>
        </div>
    </>
}
function NoOrder() {
    return <>
        <div style={{textAlign: "center"}}>沒有訂單</div>
    </>
}

/* ======================================== */
OrderCards.NoOrder = NoOrder
OrderCards.ProductCard = ProductCard
export default OrderCards