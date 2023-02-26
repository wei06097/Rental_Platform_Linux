/* CSS */
import style from "./MyStore.module.css"

/* React Components */
import OverviewCards from "../../global/components/OverviewCards"

/* header 的按鈕 */
import Back from "../../global/icon/Back"
import Home from "../../global/icon/Home"

/* React Hooks */
import { useEffect } from "react"
import { Link } from "react-router-dom"

/* Functions */

/* React Components */

export default function MyStore() {
    const description = `● JANコード：4545784068700

    ● 預約本商品須支付訂金$600或全額付清。(※標題含超取免訂金之商品除外)
    
    ● 免訂金商品：每人限購1個，2個以上須支付訂金。`
    const Array = [1, 2, 3, 4, 5, 6, 7, 8, 9]
    useEffect( () => {
        document.title = `${"小杏"}的賣場`
        window.scrollTo({"top": 0})
    }, [])
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
                    <div>小杏的賣場</div>
                    <div>
                        <Link to="/ChatList/ChatRoom">
                            <button className="button">聊天</button>
                        </Link>
                        <Link to="/MyProducts">
                            <button className="button">我的商品</button>
                        </Link>
                        <Link to="/MyOrder">
                            <button className="button">我的訂單</button>
                        </Link>
                    </div>
                </div>
                <div className={style.intro}>
                    {description}
                </div>
                <div className={style.contact}>
                    <div>
                        <span>手機</span>
                        <span>09xx xxx xxx</span>
                    </div>
                    <div>
                        <span>信箱</span>
                        <span>123@gmail.com</span>
                    </div>
                </div>
            </div>
            <OverviewCards>
                {
                    Array.map( (element, i) => 
                        <OverviewCards.ProductCard
                            key={i}
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