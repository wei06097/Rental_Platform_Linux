/* import */
/* ======================================== */
/* API */
import API from "../../API"
/* Components */
import SearchBar from "../../global/components/SearchBar"
import OverviewCards from "../../global/components/OverviewCards"
/* header 的按鈕 */
import Back from "../../global/icon/Back"
import ShoppingCart from "../../global/icon/ShoppingCart"
import Home from "../../global/icon/Home"
/* React Hooks */
import { useState, useEffect } from "react"

/* ======================================== */
/* React Components */
export default function Result() {
    const [queryParams, setQueryParams] = useState([])
    const [products, setProducts] = useState([])

    useEffect(() => {
        document.title = `搜尋結果 : ${queryParams.join(" ")}`
        const queryString = queryParams
            .map(param => encodeURIComponent(param))
            .join("%20")
        searchProducts(queryString)
    }, [queryParams])

    async function searchProducts(queryString) {
        const {result} = await API.get(`${API.RESULT}/?queryString=${queryString}`, null)
        setProducts(result)
    }

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
            <SearchBar
                setQueryParams={setQueryParams}
            />
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