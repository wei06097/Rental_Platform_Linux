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
import OverviewCards from "../../global/components/OverviewCards"
/* Hooks */
import { useEffect } from "react"
import { Link } from "react-router-dom"
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
        <header>
            <div className="flex_center">
                <h1 className={style.logo}>租借平台</h1>
            </div>
            <div className="flex_center">
                <Link to="result">
                    <button className="icon-button">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-search" viewBox="0 0 16 16">
                            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
                        </svg>
                    </button>
                </Link>
                <ShoppingCart />
                <Message />
                <User/>
            </div>
        </header>
        <main className="main">
            <GotoTop />
            <Reload reloadHandler={reloadHandler} />
            <div className={style.rent}>
                臺灣科技大學 租借平台
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
