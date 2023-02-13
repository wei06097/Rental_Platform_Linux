/* Components */
import OverviewCards from "../../global/components/OverviewCards"

/* header 的按鈕 */
import Home from "../../global/icon/Home"
import Back from "../../global/icon/Back"

/* React Hooks */
import { useEffect } from "react"

/* Functions */

/* React Components */
export default function HomePage() {
    const Array = [1, 2, 3]
    useEffect( () => {
        document.title = "我的收藏"
    }, [])
    /* ==================== 分隔線 ==================== */
    return <>
        <header>
            <div className="flex_center">
                <Back />
                <span>我的收藏</span>
            </div>
            <div className="flex_center">
                <Home />
            </div>
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