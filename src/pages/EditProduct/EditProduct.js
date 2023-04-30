/* import */
/* ======================================== */
/* CSS */
import style from "./EditProduct.module.css"
/* API */
import API from "../../global/API"
/* Functions */
import AccountActions from "../../global/functions/AccountActions"
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
    const [remoteImgs, setRemoteImgs] = useState([])
    const [inputImgs, setInputImgs] = useState([])
    const nameRef = useRef()
    const descriptionRef = useRef()
    const priceRef = useRef()
    const amountRef = useRef()
    const positionRef = useRef()

    useEffect( () => {
        if (id === "new") {
            document.title = "新增商品"
            checkLogin()
        } else if (Number.isInteger(Number(id))) {
            document.title = "編輯商品"
            getInfo()
        } else {
            goHome()
        }
        function goHome() {
            window.location.replace("/")
        }
        async function checkLogin() {
            if (!await AccountActions.check()) goHome()
        }
        async function getInfo() {
            const token = localStorage.getItem("token")
            const {success, info} = await API.get(`${API.CRUD_PRODUCT}/?id=${id}`, token)
            if (!success) goHome()
            const {imgs, name, description, price, amount, position} = info
            setRemoteImgs(imgs.map( img => `${API.WS_URL}/${img}`))
            nameRef.current.value = name
            descriptionRef.current.value = description
            priceRef.current.value = price
            amountRef.current.value = amount
            positionRef.current.value = position
        }
    }, [id])

    /* ==================== 分隔線 ==================== */
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
    async function postProduct(mode, launched) {
        // 取得 inputs
        const remain_imgs = remoteImgs.map( img => img.replace(`${API.WS_URL}/`, "") )
        const imgs = inputImgs
        const name = nameRef.current.value
        const description = descriptionRef.current.value
        const price = priceRef.current.value
        const amount = amountRef.current.value
        const position = positionRef.current.value
        // 檢查 inputs
        const notValid = !InputChecker.noBlank(name, description, price, amount, position)
        const noImg = !remain_imgs.concat(imgs)[0]
        if (notValid) alert("請確認欄位皆已填寫")
        else if (noImg) alert("請確認至少上傳1張照片")
        if (notValid || noImg) return
        // post
        const token = localStorage.getItem("token")
        const payload = (mode === "add")
            ? {launched, imgs, name, description, price, amount, position}
            : {remain_imgs, imgs, name, description, price, amount, position}
        const {success} = (mode === "add")
            ? await API.post(API.CRUD_PRODUCT, token, payload)
            : await API.put(`${API.CRUD_PRODUCT}/?id=${id}`, token, payload)
        if (!success) alert("儲存商品失敗")
        else navigate(-1)
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
                            remoteImgs.concat(inputImgs).map( (element, i) => 
                                <Photo
                                    key={i}
                                    order={i}
                                    src={element}
                                    sets={[setRemoteImgs, setInputImgs]}
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
                <button className="button grow" onClick={() => {postProduct('add', true)}}>上架</button>
                <button className="button grow" onClick={() => {postProduct('add', false)}}>儲存</button>
            </> }
            { Number.isInteger(Number(id)) && "編輯商品" && <>
                <button className="button grow" onClick={() => {navigate(-1)}}>取消</button>
                <button className="button grow" onClick={() => {postProduct('edit')}}>儲存</button>
            </> }
        </footer>
    </>
}

const Photo = ({ order, src, sets }) => {
    const first = (order === 0)
    function deletePhoto() {
        sets.forEach( set => {
            set( prev => {
                const result = [...prev]
                const index = prev.indexOf(src)
                if (index !== -1) result.splice(index, 1)
                return result
            })
        })
    }
    return <>
        <div className={style.preview_photo} cover={first? "封面照片": ""}>
            <img src={src} alt="" />
            <svg onClick={deletePhoto} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash-fill" viewBox="0 0 16 16">
                <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z"/>
            </svg>
        </div>
    </>
}