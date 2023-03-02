/* import */
/* ======================================== */
/* CSS */
import style from "./EditProduct.module.css"
/* Functions */
import InputChecker from "../../global/functions/InputChecker"
/* header 的按鈕 */
import Back from "../../global/icon/Back"
/* React Hooks */
import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"

/* ======================================== */
/* React Components */
export default function EditProduct() {
    const {id} = useParams()
    const [inputImgs, setInputImgs] = useState([])
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
            // const url = URL.createObjectURL(fileData)
            // setInputImgs(prev => [...prev, url])
            const reader = new FileReader()
            reader.readAsDataURL(fileData)
            reader.addEventListener("load", () => {
                const base64Pic = reader.result
                setInputImgs(prev => [...prev, base64Pic])
            }, false)
        }
        e.target.value = "";
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
                    <input type="text" />
                </div>
                <div className={style.description}>
                    <div>描述</div>
                    <textarea rows="10" wrap="soft"></textarea>
                </div>
                <div className={style.inline}>
                    <span>價格</span>
                    <input type="number" placeholder="0" />
                </div>
                <div className={style.inline}>
                    <span>數量</span>
                    <input type="number" placeholder="0" />
                </div>
                <div className={style.inline}>
                    <span>商品位置</span>
                    <input type="text" placeholder="位置" />
                </div>
            </div>
        </main>
        <div className="base" />
        <footer>
            <button className="button grow">儲存</button>
            <button className="button grow">上架</button>
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