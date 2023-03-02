/* CSS */
import style from "./MyProducts.module.css"

/* header 的按鈕 */
import Back from "../../global/icon/Back"
import Home from "../../global/icon/Home"

/* React Hooks */
import { useState, useEffect } from "react"
import { Link } from "react-router-dom"

/* Functions */
async function getProducts() {
    /* "id" "title" "price" "description" "images" "creationAt" "updatedAt" "category" */
    const API = "https://api.escuelajs.co/api/v1/products"
    try {
        const res = await fetch(API)
        const datas = await res.json() 
        return Promise.resolve(datas)
    } catch {
        return Promise.reject()
    }
}

/* React Components */
let count = 5, step = 5
export default function MyProducts() {
    const [Array, setArray] = useState([])
    useEffect( () => {
        document.title = "我的商品"
        let products = []
        getProducts().then( result => {
            products = result
            setArray(products.slice(0, count))
        })
        window.addEventListener("scroll", moreProducts)
        function moreProducts() {
            const body = document.body
            const bottomDistance = body.scrollHeight + body.getBoundingClientRect().y
            if (bottomDistance < 1000) {
                count = (count + step > products.length)? products.length: count + step
                setArray(products.slice(0, count))
            }
        }
        return () => {
            window.removeEventListener('scroll', moreProducts)
        }
    }, [])
    /* ==================== 分隔線 ==================== */
    return <>
        <header>
            <div className="flex_center">
                <Back />
                <span>我的商品</span>
            </div>
            <div>
                <Home />
            </div>
        </header>
        <main className="main">
            {
                Array.map( element => 
                    <Card 
                        key={element?.id || ""}
                        item={element || ""}
                    />
                )
            }
        </main>
        <div className="base" />
        <footer>
            <Link className={`${style.link} flex_center grow`} to="/EditProduct">
                <button className="button grow">新增商品</button>
            </Link>
        </footer>
    </>
}

const Card = ({ item }) => {
    return <>
        <div className={style.product}>
            <div className={style.product_info}>
                <div className={style.img}>
                    <img src="https://placeimg.com/640/480/any" alt="" />
                </div>
                <div className={style.content}>
                    <p className={style.product_name}>{item?.title || ""}</p>
                    <div className={style.product_price}>NT$ {item?.price || ""} / 每天</div>
                </div>
            </div>
            <div className={style.product_btnGroup}>
                <button className="button grow">下架</button>
                <button className="button grow">編輯</button>
                <button className="button grow">刪除</button>
            </div>
        </div>
    </>
}