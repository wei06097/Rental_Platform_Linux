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
/* Functions */
async function launchProduct(id, launched, refresh) {
    const token = localStorage.getItem("token")
    const {success} = await API.put(`${API.LAUNCH_PRODUCT}/?id=${id}`, token, {launched})
    if (!success) alert("操作失敗")
    else refresh()
}
async function deleteProduct(id, refresh) {
    const confirm = window.confirm("確定要刪除")
    if (!confirm) return
    const token = localStorage.getItem("token")
    const {success} = await API.del(`${API.CRUD_PRODUCT}/?id=${id}`, token)
    if (!success) alert("刪除商品失敗")
    else refresh()
}

/* React Components */
let showAvailable = true
export default function MyProducts() {
    const navigate = useNavigate()
    const [available, setAvailable] = useState(showAvailable)
    const [products1, setProducts1] = useState([])
    const [products2, setProducts2] = useState([])
    useEffect( () => {
        document.title = "我的商品"
        getMyProducts()
    }, [])
    async function getMyProducts() {
        const token = localStorage.getItem("token")
        const {success, avl_products, na_products} = await API.get(API.MY_PRODUCTS, token)
        if (!success) window.location.replace("/")
        setProducts1(avl_products)
        setProducts2(na_products)
    }
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
                && <div style={{textAlign: "center"}}>沒有商品</div>
            }
            {
                products1.map( element =>
                    <Card
                        key={element.id}
                        show={available}
                        item={element}
                        toEditPage={() => {navigate(`/EditProduct/${element.id}`)}}
                        refresh={getMyProducts}
                    />
                )
            }
            {
                products2.map( element =>
                    <Card
                        key={element.id}
                        show={!available}
                        item={element}
                        toEditPage={() => {navigate(`/EditProduct/${element.id}`)}}
                        refresh={getMyProducts}
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

const Card = ({ show, item, toEditPage, refresh }) => {
    return <>
        <div className={show? style.product: style.none}>
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
                <button className="button grow"
                    onClick={() => {deleteProduct(item.id, refresh)}}>
                    刪除
                </button>
                <button className="button grow"
                    onClick={() => {launchProduct(item.id, !item?.launched, refresh)}}>
                    {item?.launched? "下架": "上架"}
                </button>
                <button className="button grow"
                    onClick={toEditPage}>
                    編輯
                </button>
            </div>
        </div>
    </>
}