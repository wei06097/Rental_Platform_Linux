/* import */
/* ======================================== */
/* CSS */
import style from "./EditProduct.module.css"
/* Functions */
import InputChecker from "../../global/functions/InputChecker"
/* Components */
import Back from "../../global/icon/Back"
import Photo from "./Components/Photo"
/* Hooks */
import { useEffect, useRef } from "react"
import { useParams, useNavigate } from "react-router-dom"
/* Redux */
import { useSelector, useDispatch } from "react-redux"
import { verifyJWT } from "../../slice/accountSlice"
import { getProductInfo, addImg, submit, resetState } from "../../slice/editProductSlice"
import { getMyProducts, recordScrollY } from "../../slice/myProductSlice"

/* ======================================== */
/* React Components */
export default function EditProduct() {
    const {id} = useParams()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const {isLogin, isHandling} = useSelector(state => state.account)
    const {data, isAccessible, isLoading, isCompleted} = useSelector(state => state.editProduct)
    
    const isDisabled = isHandling || isLoading
    const {name, description, price, amount, position, remain_imgs, imgs} = data
    const nameRef = useRef()
    const descriptionRef = useRef()
    const priceRef = useRef()
    const amountRef = useRef()
    const positionRef = useRef()
    const title = (id === "new")? "新增商品": "編輯商品"
    
    useEffect(() => {
        document.title = title
        window.scrollTo(0, 0)
        const unloadHandler = (e) => {e.returnValue = ""}
        window.addEventListener("beforeunload", unloadHandler)
        return () => {
            window.removeEventListener("beforeunload", unloadHandler)
        }
    }, [title])
    useEffect(() => {
        if (!isLogin || !isAccessible) {
            // 權限不符合
            dispatch(resetState())
            navigate("/", {replace: true})
        } else if (isCompleted) {
            // 完成繳交退出
            dispatch(resetState())
            dispatch(getMyProducts())
            dispatch(recordScrollY(0))
            navigate(-1)
        } else {
            // 檢查JWT/請求資料
            dispatch(resetState())
            if (id === "new") dispatch(verifyJWT())
            else dispatch(getProductInfo({id}))
        }
    }, [navigate, dispatch, isLogin, isAccessible, isCompleted, id])

    useEffect(() => {
        nameRef.current.value = name
        descriptionRef.current.value = description
        priceRef.current.value = price
        amountRef.current.value = amount
        positionRef.current.value = position
    }, [name, description, price, amount, position])

    function onInputImgChange(e) {
        const length = e.target.files.length
        for (let i=0; i<length; i++) {
            const fileData = e.target.files[i]
            if (!InputChecker.isImageFormat(fileData)) continue
            const reader = new FileReader()
            reader.readAsDataURL(fileData)
            reader.addEventListener("load", () => {
                const base64Pic = reader.result
                dispatch(addImg(base64Pic))
            }, false)
        }
    }
    function submitHandler(mode, launched=false) {
        // 取得 inputs
        const name = nameRef.current.value
        const description = descriptionRef.current.value
        const price = priceRef.current.value
        const amount = amountRef.current.value
        const position = positionRef.current.value
        // 檢查 inputs
        const isLegal = InputChecker.noBlank(name, description, price, amount, position)
        const hasImg = !(!remain_imgs.concat(imgs)[0])
        if (isLegal && hasImg) {
            const payload = (mode === "add")
                ? {name, description, price, amount, position, launched}
                : {name, description, price, amount, position}
            dispatch(submit({mode, payload}))
        } else {
            alert("請確認各欄位皆已填寫")
        }
    }

    /* ==================== 分隔線 ==================== */
    return <>
        <header>
            <div className="flex_center">
                <Back />
                <span>{title}</span>
            </div>
        </header>
        <main className="main">
            {
                isDisabled &&
                <div className="loading-ring" />
            }
            <div className={style.container}>
                <div>
                    <div>
                        <span>圖片</span>
                        <span style={{color:"#777"}}>(至少1張)</span>
                    </div>
                    <div className={style.canvas}>
                        {
                            remain_imgs.concat(imgs)
                                .map((element, i) => 
                                    <Photo key={i} order={i} src={element} 
                                        isNew={i>=remain_imgs.length}
                                    />
                                )
                        }
                        {
                            (remain_imgs.concat(imgs).length < 5) &&
                            <label>
                                <span>+加入</span>
                                <input type="file" style={{display: "none"}}
                                    accept=".png,.jpg,.jpeg,.gif" multiple 
                                    onChange={onInputImgChange}
                                    disabled={isDisabled}
                                />
                            </label>
                        }
                    </div>
                </div>
                <div className={style.product_name}>
                    <div>名稱</div>
                    <input type="text" ref={nameRef} disabled={isDisabled} />
                </div>
                <div className={style.description}>
                    <div>描述</div>
                    <textarea rows="10" wrap="soft" ref={descriptionRef} disabled={isDisabled} />
                </div>
                <div className={style.inline}>
                    <span>價格</span>
                    <input type="number" placeholder="0" ref={priceRef} 
                        onClick={(e) => {e.target.select()}} disabled={isDisabled} 
                    />
                </div>
                <div className={style.inline}>
                    <span>數量</span>
                    <input type="number" placeholder="0" ref={amountRef}
                        onClick={(e) => {e.target.select()}} disabled={isDisabled}
                    />
                </div>
                <div className={style.inline}>
                    <span>商品位置</span>
                    <input type="text" placeholder="位置" ref={positionRef} disabled={isDisabled} />
                </div>
            </div>
        </main>
        <div className="base" />
        <footer>
            <button className="button grow" onClick={()=>{navigate(-1)}}>取消</button>
            {
                (id === "new")?
                <>
                    <button className="button grow" disabled={isDisabled}
                        onClick={()=>{submitHandler("add", false)}}
                    >儲存</button>
                    <button className="button grow" disabled={isDisabled}
                        onClick={()=>{submitHandler("add", true)}}
                    >上架</button>
                </>:
                <button className="button grow" disabled={isDisabled}
                    onClick={()=>{submitHandler("edit")}}
                >儲存</button>
            }
        </footer>
    </>
}
