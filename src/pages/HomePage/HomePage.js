/* import */
/* ======================================== */
/* CSS */
import style from "./HomePage.module.css"
/* API */
import API from "../../API"
/* Components */
import ShoppingCart from "../../global/icon/ShoppingCart"
import Message from "../../global/icon/Message"
import User from "../../global/icon/User"
import Reload from "../../global/icon/Reload"
import GotoTop from "../../global/icon/GotoTop"
import SearchBar from "../Result/Components/SearchBar"
import OverviewCards from "../../global/components/OverviewCards"
/* Hooks */
import { useEffect } from "react"
/* Redux */
import { useSelector, useDispatch } from "react-redux"
import { getRecommend } from "../../slice/homepageSlice"

/* ======================================== */
/* React Components */
export default function HomePage() {
    const dispatch = useDispatch()
    const {products, isLoading, isChecked} = useSelector(state => state.homepage)
    const noData = !isChecked || !products[0]

    useEffect(() => {
        document.title = "台科大租借平台"
    }, [])
    useEffect( () => {
        if (noData) dispatch(getRecommend())
    }, [dispatch, noData])
    
    function reloadHandler() {
        dispatch(getRecommend())
    }
    
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
                    <User/>
                </div>
            </div>
            <SearchBar />
        </header>
        <main className="main">
            <GotoTop />
            <Reload reloadHandler={reloadHandler} />
            <div className={style.announcement_area}>
                <div className={style.img}>
                    <img src="https://dengekidaioh.jp/archives/003/201908/7abf06c543302ba23fa6e35a50db895b.png" alt=""></img>
                </div>
            </div>
            {
                isLoading && 
                <div className="loading-ring" />
            }
            {
                !isLoading && !products[0] &&
                <div style={{textAlign: "center"}}>沒有商品</div>
            }
            {
                !isLoading && 
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
            }
        </main>
    </>
}
