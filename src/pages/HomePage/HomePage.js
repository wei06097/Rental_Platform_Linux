/* import */
/* ======================================== */
/* CSS */
import style from "./HomePage.module.css"
/* API */
import API from "../../global/API"
/* Functions */
import AccountActions from "../../global/functions/AccountActions"
/* Components */
import SearchBar from "../../global/components/SearchBar"
import OverviewCards from "../../global/components/OverviewCards"
/* header 的按鈕 */
import ShoppingCart from "../../global/icon/ShoppingCart"
import Message from "../../global/icon/Message"
import User from "../../global/icon/User"
/* React Hooks */
import { useState, useEffect } from "react"

/* ======================================== */
/* React Components */
export default function HomePage() {
    const [logined, setLogined] = useState(false)
    const [products, setProducts] = useState([])
    useEffect( () => {
        window.scrollTo({"top": 0})
        init()
        async function init() {
            const {result} = await API.get(API.HOMEPAGE, null)
            setProducts(result || [])
        }
        // window.addEventListener("scroll", moreProducts)
        // function moreProducts() {
        //     const body = document.body
        //     const bottomDistance = body.scrollHeight + body.getBoundingClientRect().y
        //     if (bottomDistance < 1000) {}
        // }
        return () => {
            // window.removeEventListener('scroll', moreProducts)
        }
    }, [])
    useEffect(() => {
        document.title = "台科大租借平台"
        checkLogin()
        async function checkLogin() {
            setLogined(await AccountActions.check())
        }
    }, [])
    /* ==================== 分隔線 ==================== */
    return <>
        <header className="header3">
            <div>
                <div className="flex_center">
                    <h1 className={style.logo}>台科大租借平台</h1>
                </div>
                <div className="flex_center">
                    <ShoppingCart />
                    <Message />
                    <User logined={logined} setLogined={setLogined} />
                </div>
            </div>
            <SearchBar />
        </header>
        <main className="main">
            <div className={style.announcement_area}>
                <div className={style.img}>
                    <img src="https://dengekidaioh.jp/archives/003/201908/7abf06c543302ba23fa6e35a50db895b.png" alt=""></img>
                </div>
            </div>
            {
                !products[0] &&
                <div style={{textAlign: "center"}}>沒有商品</div>
            }
            <OverviewCards>
                {
                    products.map( element =>
                        <OverviewCards.ProductCard
                            key={element.id}
                            id={element.id}
                            link={`${API.WS_URL}/${element?.imgs[0] || "img/0"}`}
                            name={element?.name}
                            price={element?.price}
                            showHeart={false}
                        />
                    )
                }
            </OverviewCards>
        </main>
    </>
}