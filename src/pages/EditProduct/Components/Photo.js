/* import */
/* ======================================== */
/* CSS */
import style from "./Photo.module.css"
/* API */
import API from "../../../API"
/* HOOKs */
import { useState, useEffect, useRef } from "react"
/* Redux */
import { useDispatch } from "react-redux"
import { delImg } from "../../../slice/editProductSlice"

/* ======================================== */
export default function Photo({ order, src, isNew }) {
    const dispatch = useDispatch()
    const [loaded, setLoaded] = useState(false)
    const imgRef = useRef()
    const url = isNew? src: `${API.WS_URL}/${src}`

    useEffect(() => {
        const imgElement = imgRef.current
        const loaded = () => setLoaded(true)
        imgElement.addEventListener("load", loaded)
        return () => {
            imgElement.removeEventListener("load", loaded)
        }
    }, [])

    function deletePhoto() {
        dispatch(delImg(order))
    }

    /* ==================== 分隔線 ==================== */
    return <>
        <div className={style.preview_photo} cover={(order===0)? "封面": ""}>
            <div className={style.img}>
                {!loaded && <div className="fill skeleton" />}
                <img
                    ref={imgRef}
                    style={{opacity:loaded?1:0}} loading="lazy" alt=""
                    src={url}
                />
                <svg onClick={deletePhoto} style={{opacity:loaded?1:0}}
                    xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash-fill" viewBox="0 0 16 16">
                    <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z"/>
                </svg>
            </div>
        </div>
    </>
}
