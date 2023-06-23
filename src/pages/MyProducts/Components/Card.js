/* import */
/* ======================================== */
/* CSS */
import style from "./Card.module.css"
/* API */
import API from "../../../global/API"
/* React Hooks */
import { useState, useEffect, useRef } from "react"
import { useSelector, useDispatch } from "react-redux"
import { deleteProduct, launchProduct } from "../../../store/myProductSlice"

/* ======================================== */
/* React Components */
export default function Card({ item, launched, toEditPage }) {
    const dispatch = useDispatch()
    const {isHandling} = useSelector(state => state.myProduct)
    const imgRef = useRef()
    const [loaded, setLoaded] = useState(false)

    useEffect(() => {
        const imgElement = imgRef.current
        const loaded = () => setLoaded(true)
        imgElement.addEventListener("load", loaded)
        return () => {
            imgElement.removeEventListener("load", loaded)
        }
    }, [])

    function deleteHandler(id) {
        const confirm = window.confirm("確定要刪除")
        if (!confirm) return
        dispatch(deleteProduct({id}))
    }
    function launchHandler(id, launched) {
        dispatch(launchProduct({id, launched}))
    }

    /* ==================== 分隔線 ==================== */
    return <>
        <div className={style.product}>
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
                    onClick={() => {deleteHandler(item.id)}}
                    disabled={isHandling}>
                    刪除
                </button>
                <button className="button grow"
                    onClick={() => {launchHandler(item.id, !launched)}}
                    disabled={isHandling}>
                    {launched? "下架": "上架"}
                </button>
                <button className="button grow"
                    onClick={toEditPage}
                    disabled={isHandling}>
                    編輯
                </button>
            </div>
        </div>
    </>
}
