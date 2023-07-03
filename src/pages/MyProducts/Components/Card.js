/* import */
/* ======================================== */
/* CSS */
import style from "./Card.module.css"
/* API */
import API from "../../../API"
/* React Hooks */
import { useState, useEffect, useRef } from "react"
import { useSelector, useDispatch } from "react-redux"
import { deleteProduct, launchProduct } from "../../../slice/myProductSlice"

/* ======================================== */
/* React Components */
export default function Card({ item, launched, toEditPage }) {
    const dispatch = useDispatch()
    const {isHandling} = useSelector(state => state.myProduct)
    const imgRef = useRef()
    const [loaded, setLoaded] = useState(false)
    const {imgs, name, price, amount, BorrowedAmount} = item
    
    useEffect(() => {
        const imgElement = imgRef.current
        const loaded = () => setLoaded(true)
        imgElement.addEventListener("load", loaded)
        if (imgElement.complete) setLoaded(true)
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
                        src={`${API.WS_URL}/${imgs[0] || "img/error"}`}
                    />
                </div>
                <div className={style.content}>
                    <div>{name}</div>
                    <div>
                        <div>- NT${price} / 天</div>
                        <div>- 剩餘數量 {amount}</div>
                        <div>- 借出數量 {BorrowedAmount}</div>
                    </div>
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
