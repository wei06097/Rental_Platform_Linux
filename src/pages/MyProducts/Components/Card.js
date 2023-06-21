/* import */
/* ======================================== */
/* CSS */
import style from "../MyProducts.module.css"
/* API */
import API from "../../../global/API"
/* React Hooks */
import { useState, useEffect, useRef } from "react"

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
export default function Card({ show, item, toEditPage, refresh }) {
    const [loaded, setLoaded] = useState(false)
    const imgRef = useRef()
    useEffect(() => {
        const imgElement = imgRef.current
        const loaded = () => setLoaded(true)
        imgElement.addEventListener("load", loaded)
        return () => {
            imgElement.removeEventListener("load", loaded)
        }
    }, [])

    return <>
        <div className={show? style.product: style.none}>
            <div className={style.product_info}>
                <div className={style.img}>
                    {!loaded && <div className="fill skeleton" />}
                    <img
                        ref={imgRef}
                        style={{opacity:loaded?1:0}} loading="lazy" alt=""
                        src={`${API.WS_URL}/${item?.imgs[0] || "img/error"}`}
                    />
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
