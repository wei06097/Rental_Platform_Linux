/* CSS */
import style from "./ShoppingCart.module.css"

/* Components */
import CartCards from "./components/CartCards"
import Number from "./components/Number"

/* header 的按鈕 */
import Back from "../../global/icon/Back"
import Message from "../../global/icon/Message"
import Home from "../../global/icon/Home"

/* React Hooks */
import { useEffect } from "react"
import { Link } from "react-router-dom"

/* Functions */
function fetchCart() {
    return [
        {
            provider: "賣場1",
            products: [
                {
                    name: "三顆星彩色冒險 123456789",
                    price: "100",
                    img: "https://p2.bahamut.com.tw/B/2KU/24/5a2da8c378bcd8df6058bd663f3zi104.JPG"
                },
                {
                    name: "三顆星彩色冒險 123456789 jack queen king",
                    price: "200",
                    img: "https://cs-a.ecimg.tw/items/QFCD2TD900AG1HU/000001_1607050060.jpg"
                }
            ]
        },
        {
            provider: "賣場2",
            products: [
                {
                    name: "三顆星彩色冒險 三顆星彩色冒險三顆星彩色冒險 三顆星彩色冒險三顆星彩色冒險三顆星彩色冒險 三顆星彩色冒險三顆星彩色冒險三顆星彩色冒險三顆星彩色冒險",
                    price: "300",
                    img: "https://p2.bahamut.com.tw/B/2KU/81/7a0a9e4060eb012ad158db62cdazbwd4.JPG"
                }
            ]
        },
        {
            provider: "賣場3",
            products: [
                {
                    name: "三顆星彩色冒險 - 1 - test",
                    price: "400",
                    img: "https://image.ruten.com.tw/g2/0/db/56/21824204845910_848.jpg"
                },
                {
                    name: "三顆星彩色冒險 - 2 - test",
                    price: "500",
                    img: "https://image.ruten.com.tw/g2/3/e8/94/21824207143060_522.jpg"
                },
                {
                    name: "三顆星彩色冒險 - 3 - test",
                    price: "600",
                    img: "https://image.ruten.com.tw/g2/a/ba/4a/21807686765130_133.jpg"
                }
            ]
        }
    ]
}

/* React Components */
export default function ShoppingCart() {
    const cart = fetchCart()
    useEffect( () => {
        document.title = "購物車"
    }, [])
    /* ==================== 分隔線 ==================== */
    return <>
        <header>
            <div className="flex_center">
                <Back />
                <span>購物車</span>
            </div>
            <div className="flex_center">
                <Message />
                <Home />
            </div>
        </header>
        <main className="main">
            {
                cart.map( (element, i) => 
                    <StoreCard
                        key={i}
                        provider={element?.provider || ""}
                        products={element?.products || []}
                    />
                )
            }
        </main>
        <div className="base" />
        <footer className={style.footer}>
            <div className={`${style.front}`}>
                <div>
                    <span>租借天數</span>
                    <Number />
                </div>
                <div>
                    <span>訂單金額</span>
                    <span>NT$ 200</span>
                </div>
            </div>
            <Link className={`${style.bill}`} to="/Bill">
                <button className="button" style={{height: "80%"}}>結帳</button>
            </Link>
        </footer>
    </>
}

const StoreCard = ({ provider, products }) => {
    return <>
        <div className={style.store_card}>
            <div className={style.store_card_top}>
                <input type="checkbox" className={style.checkbox} />
                <span>{provider}</span>
            </div>
            <CartCards>
                {
                    products.map( (element, i) => 
                        <CartCards.ProductCard 
                            key={i}
                            product={element}
                        />
                    )
                }
            </CartCards>
        </div>
    </>
}