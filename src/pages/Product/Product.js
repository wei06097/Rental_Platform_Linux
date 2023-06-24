/* import */
/* ======================================== */
/* CSS */
import style from "./Product.module.css"
/* API */
import API from "../../API"
/* Components */
import ImgCard from "./components/ImgCard"
/* header 的按鈕 */
import Back from "../../global/icon/Back"
import ShoppingCar from "../../global/icon/ShoppingCart"
import Home from "../../global/icon/Home"
/* React Hooks */
import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"

/* ======================================== */
/* React Components */
export default function Product() {
    const account = localStorage.getItem("account")
    const {id} = useParams()
    const [product, setProduct] = useState({})
    useEffect( () => {
        init()
        window.scrollTo({"top": 0})
        async function init() {
            const {success, product} = await API.get(`${API.PRODUCT}/?id=${id}`, null)
            if (!success) window.location.replace("/")
            else setProduct(product)
        }
    }, [id])
    useEffect(() => {
        document.title = `商品 - ${product?.name || ""}`
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
                            <span>{product?.amount || 0}</span>
                        </div>
                        <div>
                            <span>付款方式</span>
                            <span>面交</span>
                        </div>
                        <div>
                            <span>商品地點</span>
                            <span>{product?.position || "未知"}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className={style.product_description}>
                <div>賣家資訊</div>
                <div>
                    <div>{product?.provider || ""}</div>
                    <div>
                        {account && account !== product?.provider &&
                            <Link to={`/ChatRoom/${product?.provider || ""}`}>
                                <button className="button" style={{marginRight:0}}>聊天</button>
                            </Link>
                        }
                        <Link to={`/Store/${product?.provider || ""}`}>
                            <button className="button" style={{marginRight:0}}>進入賣場</button>
                        </Link>
                    </div>
                </div>
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