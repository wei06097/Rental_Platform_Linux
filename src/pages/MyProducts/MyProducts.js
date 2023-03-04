/* import */
/* ======================================== */
/* CSS */
import style from "./MyProducts.module.css"
/* API */
import API from "../../global/API"
/* header 的按鈕 */
import Back from "../../global/icon/Back"
import Home from "../../global/icon/Home"
/* React Hooks */
import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"

/* ======================================== */
let showAvailable = true
/* React Components */
export default function MyProducts() {
    const navigate = useNavigate()
    const [available, setAvailable] = useState(showAvailable)
    const [products1, setProducts1] = useState([])
    const [products2, setProducts2] = useState([])
    useEffect( () => {
        document.title = "我的商品"
        getMyProducts()
        async function getMyProducts() {
            const token = localStorage.getItem("token")
            const {success, avl_products, na_products} = await API.post(API.MY_PRODUCTS, {token})
            if (!success) window.location.replace("/")
            setProducts1(avl_products)
            setProducts2(na_products)
        }
        // window.addEventListener("scroll", moreProducts)
        // function moreProducts() {
        //     const body = document.body
        //     const bottomDistance = body.scrollHeight + body.getBoundingClientRect().y
        //     if (bottomDistance < 1000) {}
        // }
        // return () => {
        //     window.removeEventListener('scroll', moreProducts)
        // }
    }, [])
    function toggleAvailable(state) {
        showAvailable = state
        setAvailable(state)
    }
    /* ==================== 分隔線 ==================== */
    return <>
        <header className="header2">
            <div>
                <div className="flex_center">
                    <Back />
                    <span>我的商品</span>
                </div>
                <div>
                    <Home />
                </div>
            </div>
            <div>
                <div onClick={() => {toggleAvailable(true)}} className={`grow ${available? "selected": ""}`}>已上架</div>
                <div onClick={() => {toggleAvailable(false)}} className={`grow ${!available? "selected": ""}`}>未上架</div>
            </div>
        </header>
        <main className="main">
            {
                ! (available? products1: products2)[0]
                ? <div style={{textAlign: "center"}}>沒有商品</div>
                : (available? products1: products2)
                .map( element => 
                    <Card
                        key={element.id}
                        item={element}
                        toEditPage={() => {navigate(`/EditProduct/${element.id}`)}}
                    />
                )
            }
        </main>
        <div className="base" />
        <footer>
            <Link className={`${style.link} flex_center grow`} to="/EditProduct/new">
                <button className="button grow">新增商品</button>
            </Link>
        </footer>
    </>
}

const Card = ({ item, toEditPage }) => {
    return <>
        <div className={style.product}>
            <div className={style.product_info}>
                <div className={style.img}>
                    <img src={`${API.WS_URL}/${item?.imgs[0] || "img/error"}`} alt="" />
                </div>
                <div className={style.content}>
                    <p className={style.product_name}>{item?.name || "error"}</p>
                    <div className={style.product_price}>NT$ {item?.price || "error"} / 每天</div>
                </div>
            </div>
            <div className={style.product_btnGroup}>
                <button className="button grow">刪除</button>
                <button className="button grow">{item?.launched? "下架": "上架"}</button>
                <button className="button grow" onClick={toEditPage}>編輯</button>
            </div>
        </div>
    </>
}