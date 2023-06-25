/* import */
/* ======================================== */
/* CSS */
import style from "./Store.module.css"
/* API */
import API from "../../API"
/* Components */
import OverviewCards from "../../global/components/OverviewCards"
/* header 的按鈕 */
import Back from "../../global/icon/Back"
import Home from "../../global/icon/Home"
/* React Hooks */
import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
/* Redux */
import { useSelector } from "react-redux"

/* ======================================== */
/* React Components */
export default function Store() {
    const {account} = useSelector(state => state.account)
    const [info, setInfo] = useState({})
    const [products, setProducts] = useState([])
    const {seller} = useParams()
    const [title, setTitle] = useState(seller)
    useEffect( () => {
        init()
        window.scrollTo({"top": 0})
        async function init() {
            const token = localStorage.getItem("token")
            const {success, provider, products} = await API.get(`${API.STORE}/?seller=${seller}`, token)
            if (!success) window.location.replace("/")
            setProducts(products || [])
            setInfo(provider || {})
            setTitle(`${provider?.nickname || seller} 的賣場`)
            document.title = title
        }
    }, [seller, title])

    /* ==================== 分隔線 ==================== */
    return <>
        <header>
            <div className="flex_center">
                <Back />
                <span>{title}</span>
            </div>
            <div className="flex_center">
                <Home />
            </div>
        </header>
        <main className="main">
            <div className={style.info}>
                <p>簡介</p>
                <div className="fill skeleton" style={{height:"30px"}} />
                {/* <div>{info?.intro || ""}</div> */}
                <p>聯絡方式</p>
                <div className="fill skeleton" style={{height:"30px"}} />
                {/* <div>{`手機: ${info?.phone}` || ""}</div>
                <div>{`信箱: ${info?.mail}` || ""}</div> */}
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
        <div className="base"></div>
        <footer>
            {
                (account === seller)?
                <>
                    <Link className="link flex_center grow" to="/MyOrder">
                        <button className="button grow">我的訂單</button>
                    </Link>
                    <Link className="link flex_center grow" to="/MyProducts">
                        <button className="button grow">我的商品</button>
                    </Link>
                </>:
                <>
                    <Link className="link flex_center grow" to={`/ChatRoom/${seller}`}>
                        <button className="button grow">聊天</button>
                    </Link>
                </>
            }
        </footer>
    </>
}
