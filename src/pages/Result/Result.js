/* Components */
import SearchBar from "../../global/components/SearchBar"
import OverviewCards from "../../global/components/OverviewCards"

/* header 的按鈕 */
import Back from "../../global/icon/Back"
import ShoppingCart from "../../global/icon/ShoppingCart"
import Home from "../../global/icon/Home"

/* Custom Hooks */
import useScrollTop from "../../global/hooks/useScrollTop"

/* React Hooks */
import { useState, useEffect } from "react"
import { useLocation } from "react-router-dom"

/* Functions */
let counter = 0
function fetchData() {
    let array = [], number=20
    for (let i=0; i<number; i++) {
        counter += 1
        array = [...array, counter]
    }
    return array
}

/* React Components */
export default function Result() {
    const path = useLocation()
    const [Array, setArray] = useState(fetchData())
    useScrollTop(path)
    useEffect( () => {
        window.addEventListener("scroll", moreProducts)
        function moreProducts() {
            const body = document.body
            const bottomDistance = body.scrollHeight + body.getBoundingClientRect().y
            if (bottomDistance < 1000) {
                const newArray = fetchData()
                setArray(prevArray => [...prevArray, ...newArray])
            }
        }
        return () => {
            window.removeEventListener('scroll', moreProducts)
        }
    }, [])
    useEffect( () => {
        const result = decodeURI(path.search.split("?s=")[1])
        document.title = `${result} - 台科大租借平台`
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
            <OverviewCards>
                {
                    Array.map( element => 
                        <OverviewCards.ProductCard
                            key={element}
                            link={"https://cf.shopee.tw/file/7547aa6b546059505722d474287b8371"}
                            name={"三顆星彩色冒險 三顆星彩色冒險 三顆星彩色冒險 三顆星彩色冒險"}
                            price={"100"}
                            showHeart={true}
                        />
                    )
                }
            </OverviewCards>
        </main>
    </>
}