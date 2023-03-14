/* import */
/* ======================================== */
/* API */
import API from "../../global/API"
/* Components */
import SearchBar from "../../global/components/SearchBar"
import OverviewCards from "../../global/components/OverviewCards"
/* header 的按鈕 */
import Back from "../../global/icon/Back"
import ShoppingCart from "../../global/icon/ShoppingCart"
import Home from "../../global/icon/Home"
/* React Hooks */
import { useState, useEffect } from "react"
import { useLocation } from "react-router-dom"

/* ======================================== */
/* React Components */
export default function Result() {
    const path = useLocation()
    const [products, setProducts] = useState([])
    useEffect( () => {
        window.scrollTo({"top": 0})
        const keyword = decodeURI(path.search.split("?s=")[1])
        document.title = `${keyword} - 台科大租借平台`
        searchProducts(keyword)
        async function searchProducts(keyword) {
            const {result} = await API.post(API.RESULT, {keyword})
            setProducts(result)
        }
    }, [path])
    /* ==================== 分隔線 ==================== */
    return <>
        <header className="header3">
            <div>
                <div className="flex_center">
                    <Back />
                    <span>搜尋結果</span>
                </div>
                <div className="flex_center">
                    <ShoppingCart />
                    <Home />
                </div>
            </div>
            <SearchBar />
        </header>
        <main className="main">
            {
                !products[0] &&
                <div style={{textAlign: "center"}}>沒有符合的商品</div>
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