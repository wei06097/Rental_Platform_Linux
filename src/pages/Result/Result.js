/* import */
/* ======================================== */
/* API */
import API from "../../API"
/* Components */
import Back from "../../global/icon/Back"
import ShoppingCart from "../../global/icon/ShoppingCart"
import Home from "../../global/icon/Home"
import Reload from "../../global/icon/Reload"
import GotoTop from "../../global/icon/GotoTop"
import SearchBar from "../../global/components/SearchBar"
import OverviewCards from "../../global/components/OverviewCards"
/* Hooks */
import { useState, useEffect } from "react"
/* Redux */
import { queryProducts } from "../../slice/resultSlice"
import { useSelector, useDispatch } from "react-redux"
/* Fcntion */
import { encodeURLfromArr } from "../../global/components/SearchBar"

/* ======================================== */
/* React Components */
export default function Result() {
    const dispatch = useDispatch()
    const {isLoading, history} = useSelector(state => state.result)
    const [queryParams, setQueryParams] = useState([])

    const title = queryParams.join(" ")
    const queryString = encodeURLfromArr(queryParams)
    const haveData = Object.keys(history).includes(queryString)
    const products = haveData? history[queryString]: []

    useEffect(() => {
        window.scroll(0, 0)
    }, [])
    useEffect(() => {
        document.title = `搜尋結果 : ${title}`
        if(!haveData) dispatch(queryProducts({queryString}))
    }, [dispatch, title, queryString, haveData])

    function reloadHandler() {
        dispatch(queryProducts({queryString}))
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
                forceQuery={queryProducts}
                history={history}
            />
        </header>
        <main className="main">
            <GotoTop />
            <Reload reloadHandler={reloadHandler} />
            {
                isLoading?
                <div className="loading-ring" />:
                !products[0]?
                <div style={{textAlign: "center"}}>沒有符合的商品</div>:
                <OverviewCards>
                    {
                        products
                            .map( element => 
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
