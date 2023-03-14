/* import */
/* ======================================== */
/* CSS */
import style from "./Store.module.css"
/* API */
import API from "../../global/API"
/* Components */
import OverviewCards from "../../global/components/OverviewCards"
/* header 的按鈕 */
import Back from "../../global/icon/Back"
import Home from "../../global/icon/Home"
/* React Hooks */
import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"

/* ======================================== */
/* React Components */
export default function Store() {
    const account = localStorage.getItem("account")
    const [info, setInfo] = useState({})
    const [products, setProducts] = useState([])
    const {seller} = useParams()
    useEffect( () => {
        init()
        window.scrollTo({"top": 0})
        async function init() {
            const token = localStorage.getItem("token")
            const {success, provider, products} = await API.post(API.STORE, {token, seller})
            if (!success) window.location.replace("/")
            setProducts(products || [])
            setInfo(provider || {})
            document.title = `${provider?.nickname || seller} 的賣場`
        }
    }, [seller])
    /* ==================== 分隔線 ==================== */
    return <>
        <header>
            <div className="flex_center">
                <Back />
                <span>賣場</span>
            </div>
            <div className="flex_center">
                <Home />
            </div>
        </header>
        <main className="main">
            <div className={style.info}>
                <div className={style.seller}>
                    <div>{info?.nickname || ""}</div>
                    <div>
                        {(account === seller) &&
                        <>
                            <Link to="/MyProducts">
                                <button className="button">我的商品</button>
                            </Link>
                            <Link to="/MyOrder">
                                <button className="button">我的訂單</button>
                            </Link>
                        </>}
                        {(account && account !== seller) &&
                        <>
                            <Link to={`/ChatRoom/${seller}`}>
                                <button className="button">聊天</button>
                            </Link>
                        </>}
                    </div>
                </div>
                <div className={style.intro}>{info?.intro || ""}</div>
                <div className={style.contact}>
                    <div>
                        <span>手機</span>
                        <span>{info?.phone || ""}</span>
                    </div>
                    <div>
                        <span>信箱</span>
                        <span>{info?.mail || ""}</span>
                    </div>
                </div>
            </div>
            {
                ! (products[0])
                ? <div style={{textAlign: "center"}}>沒有商品</div>
                : <OverviewCards>
                    {
                        products.map( element => 
                            <OverviewCards.ProductCard
                                key={element.id}
                                id={element.id}
                                link={`${API.WS_URL}/${element?.imgs[0] || "img/0"}`}
                                name={element?.name || ""}
                                price={element?.price || ""}
                                showHeart={false}
                            />
                        )
                    }
                </OverviewCards>
            }
        </main>
    </>
}