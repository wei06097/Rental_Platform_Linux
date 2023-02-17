/* CSS */
import style from "./Product.module.css"

/* Components */
import ImgCard from "./components/ImgCard"

/* header 的按鈕 */
import Back from "../../global/icon/Back"
import ShoppingCar from "../../global/icon/ShoppingCart"
import Home from "../../global/icon/Home"

/* Custom Hooks */
import useScrollTop from "../../global/hooks/useScrollTop"

/* React Hooks */
import { useEffect } from "react"
import { useParams } from "react-router-dom"
/* Functions */
function fetchData() {
    return {
        name : "三顆星彩色冒險 三顆星彩色冒險 三顆星彩色冒險 三顆星彩色冒險 三顆星彩色冒險 三顆星彩色冒險 三顆星彩色冒險",
        price : "1500",
        imgs : [
            "https://cf.shopee.tw/file/7547aa6b546059505722d474287b8371",
            "https://taiwan-image.bookwalker.com.tw/product/21848/zoom_big_21848.jpg",
            "https://img02.sogoucdn.com/app/a/201103/0575016fe303c2dc-e5a9da1173fed286-15c2b32e7ae84adf2f81bb7093352fb5",
            "https://miro.medium.com/max/630/1*MBb7iatu9etCcQQGxUXpbg.jpeg",
            "https://images.vocus.cc/24ecf706-e036-4dd4-9781-c917e98113a5.gif"
        ],
        description:
            `● JANコード：4545784068700
    
            ● 預約本商品須支付訂金$600或全額付清。(※標題含超取免訂金之商品除外)
                    
            ● 免訂金商品：每人限購1個，2個以上須支付訂金。`
    }
}

/* React Components */
export default function Product() {
    const params = useParams()
    useScrollTop()
    const product = fetchData()
    useEffect( () => {
        document.title = `產品 ${params?.id} : ${product?.name}` || "商品資訊"
    }, [product])
    /* ==================== 分隔線 ==================== */
    return <>
        <header>
            <div className="flex_center">
                <Back />
                <span>商品資訊</span>
            </div>
            <div className="flex_center">
                <ShoppingCar />
                <Home />
            </div>
        </header>
        <main className={style.main}>
            <div className={style.top}>
                <ImgCard ImgArray={product?.imgs || []}/>
                <div className={style.product_info}>
                    <div className={style.product_name}>
                        <h1>{product?.name || ""}</h1>
                    </div>
                    <div className={style.product_price}>NT$ {product?.price || ""} / 每天</div>
                    <div className={style.detail}>
                        <div>
                            <span>剩餘數量</span>
                            <span>1</span>
                        </div>
                        <div>
                            <span>付款方式</span>
                            <span>面交</span>
                        </div>
                        <div>
                            <span>商品地點</span>
                            <span>TR-301</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className={style.product_provider}>賣場資訊</div>
            <div className={style.product_description}>
                <div>商品詳情</div>
                <div>{product?.description || ""}</div>
            </div>
        </main>
        <div className="base" />
        <footer>
            <button className="button buttonText grow">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="icon bi bi-heart-fill" viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"/>
                </svg>
                <span>收藏</span>
            </button>
            <button className="button buttonText grow">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="icon bi bi-cart-plus-fill" viewBox="0 0 16 16">
                    <path d="M.5 1a.5.5 0 0 0 0 1h1.11l.401 1.607 1.498 7.985A.5.5 0 0 0 4 12h1a2 2 0 1 0 0 4 2 2 0 0 0 0-4h7a2 2 0 1 0 0 4 2 2 0 0 0 0-4h1a.5.5 0 0 0 .491-.408l1.5-8A.5.5 0 0 0 14.5 3H2.89l-.405-1.621A.5.5 0 0 0 2 1H.5zM6 14a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm7 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM9 5.5V7h1.5a.5.5 0 0 1 0 1H9v1.5a.5.5 0 0 1-1 0V8H6.5a.5.5 0 0 1 0-1H8V5.5a.5.5 0 0 1 1 0z"/>
                </svg>
                <span>加入購物車</span>
            </button>
            <button className="button grow">直接購買</button>
        </footer>
    </>
}