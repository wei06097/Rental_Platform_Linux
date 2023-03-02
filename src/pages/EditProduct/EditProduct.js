/* import */
/* ======================================== */
/* CSS */
import style from "./EditProduct.module.css"
/* API */
import API from "../../global/API"
/* Functions */
import InputChecker from "../../global/functions/InputChecker"
/* header 的按鈕 */
import Back from "../../global/icon/Back"
/* React Hooks */
import { useState, useEffect, useRef } from "react"
import { useParams, useNavigate } from "react-router-dom"

/* ======================================== */
/* React Components */
export default function EditProduct() {
    const {id} = useParams()
    const navigate = useNavigate()
    const [inputImgs, setInputImgs] = useState([])
    const nameRef = useRef()
    const descriptionRef = useRef()
    const priceRef = useRef()
    const amountRef = useRef()
    const positionRef = useRef()

    useEffect( () => {
        if (id === "new") {
            document.title = "新增商品"
        } else if (Number.isInteger(Number(id))) {
            document.title = "編輯商品"
        } else {
            window.location.replace("/")
        }
    }, [id])
    function onInputImgChange(e) {
        const length = e.target.files.length
        for (let i=0; i<length; i++) {
            const fileData = e.target.files[i]
            if (! InputChecker.isImageFormat(fileData)) continue
            const reader = new FileReader()
            reader.readAsDataURL(fileData)
            reader.addEventListener("load", () => {
                const base64Pic = reader.result
                setInputImgs(prev => [...prev, base64Pic])
            }, false)
        }
        e.target.value = "";
    }

    async function postProduct(launched) {
        // 取的 inputs
        const imgs = inputImgs
        const name = nameRef.current.value
        const description = descriptionRef.current.value
        const price = priceRef.current.value
        const amount = amountRef.current.value
        const position = positionRef.current.value
        // 檢查 inputs
        const isValid = InputChecker.noBlank(name, description, price, amount, position)
        if (!isValid) alert("請確認欄位皆已填寫")
        else if (!imgs[0]) alert("請確認至少上傳1張照片")
        if (!isValid || !imgs[0]) return
        // post
        const token = localStorage.getItem("token")
        const payload = {token, launched, imgs, name, description, price, amount, position}
        const result = await API.post(API.ADD_PRODUCT, payload)
        if (result?.success) navigate(-1)
        else alert("儲存商品失敗")
    }

    /* ==================== 分隔線 ==================== */
    return <>
        <header>
            <div className="flex_center">
                <Back />
                <span>
                    { (id === "new") && "新增商品" }
                    { Number.isInteger(Number(id)) && "編輯商品" }
                </span>
            </div>
        </header>
        <main className="main">
            <div className={style.container}>
                <div>
                    <div>圖片</div>
                    <div className={style.canvas}>
                        <label>
                            <input type="file" style={{display: "none"}} accept=".png,.jpg,.jpeg,.gif" multiple 
                                onChange={onInputImgChange} />
                            +加入照片
                        </label>
                        {
                            inputImgs.map( (element, i) => 
                                <Photo
                                    key={i}
                                    order={i}
                                    src={element}
                                    set={setInputImgs}
                                />
                            )
                        }
                    </div>
                </div>
                <div className={style.product_name}>
                    <div>名稱</div>
                    <input type="text" ref={nameRef} />
                </div>
                <div className={style.description}>
                    <div>描述</div>
                    <textarea rows="10" wrap="soft" ref={descriptionRef} />
                </div>
                <div className={style.inline}>
                    <span>價格</span>
                    <input type="number" placeholder="0"
                        onClick={(e) => {e.target.select()}} ref={priceRef} />
                </div>
                <div className={style.inline}>
                    <span>數量</span>
                    <input type="number" placeholder="0"
                        onClick={(e) => {e.target.select()}} ref={amountRef} />
                </div>
                <div className={style.inline}>
                    <span>商品位置</span>
                    <input type="text" placeholder="位置" ref={positionRef} />
                </div>
            </div>
        </main>
        <div className="base" />
        <footer>
            { (id === "new") && <>
                <button className="button grow" onClick={() => {postProduct(true)}}>上架</button>
                <button className="button grow" onClick={() => {postProduct(false)}}>儲存</button>
            </> }
            { Number.isInteger(Number(id)) && "編輯商品" && <>
                <button className="button grow">儲存</button>
            </> }
        </footer>
    </>
}

const Photo = ({ order, src, set }) => {
    function deletePhoto() {
        set( prev => {
            let result = [...prev]
            result.splice(prev.indexOf(src), 1)
            return result
        })
    }
    return <>
        <div className={style.preview_photo} cover={(order===0)? "封面照片": ""}>
            <img src={src} alt="" />
            <svg onClick={deletePhoto} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash-fill" viewBox="0 0 16 16">
                <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z"/>
            </svg>
        </div>
    </>
}