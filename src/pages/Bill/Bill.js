/* CSS */
import style from "./Bill.module.css"

/* Components */
import DetailCards from "../../global/components/DetailCards"

/* header 的按鈕 */
import Back from "../../global/icon/Back"

/* React Hooks */
import { useEffect } from "react"

/* Functions */

/* React Components */
export default function Bill() {
    useEffect( () => {
        document.title = "結帳"
    }, [])
    return <>
        <header>
            <div className="flex_center">
                <Back />
                <span>結帳</span>
            </div>
        </header>
        <main className="main">
            <div className={style.description}>
                <div>留言</div>
                <textarea rows="10" wrap="soft"></textarea>
            </div>
            <DetailCards>
                <DetailCards.ProductCard />
                <DetailCards.ProductCard />
                <DetailCards.ProductCard />
            </DetailCards>
        </main>
        <div className="base"></div>
        <footer className={style.footer}>
            <div className={style.total}>
                <span>訂單金額</span>
                <span>NT$ 200</span>
            </div>
            <button className="button">確定</button>
        </footer>
    </>
}