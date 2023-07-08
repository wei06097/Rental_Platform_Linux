/* import */
/* ======================================== */
/* API */
import API from "../../API"
/* CSS */
import style from "./Message.module.css"
/* Hooks */
import { useState, useEffect, useRef } from "react"

/* ======================================== */
export default function Message({ lastDateTime, message, fromMe }) {
    const imgRef = useRef()
    const [loaded, setLoaded] = useState(false)
    const [date, time] = message.datetime.slice().split("T")
    const days = (new Date(Date.now()) - new Date(message.datetime)) / (24 * 3600 * 1000)
    const string = (days > 2)? date: (days > 1)? "昨天": "今天"
    const dayDiff = (new Date(message.datetime) - new Date(lastDateTime)) / (24 * 3600 * 1000)

    useEffect(() => {
        autoScroll()
        if (message.type === "text") return
        const imgElement = imgRef.current
        const loaded = () => {
            setLoaded(true)
            autoScroll()
        }
        imgElement.addEventListener("load", loaded)
        if (imgElement.complete) {
            setLoaded(true)
            autoScroll()
        }
        function autoScroll() {
            const body = document.body
            const bottomDistance = body.scrollHeight + body.getBoundingClientRect().y
            const toBottom = (bottomDistance < 1250 || fromMe)
            if (toBottom) window.scrollTo("top", body.clientHeight)
        }
        return () => {
            imgElement.removeEventListener("load", loaded)
        }
    }, [message, fromMe])

    /* ==================== 分隔線 ==================== */
    return <>
        {
            dayDiff > 1 &&
            <div className={style.date}>{string}</div>
        }
        {
            (message.type === "text")?
            <div className={`${style.card} ${fromMe? style.right: style.left}`}
                time={time}>
                {message.content}
            </div>:
            <div className={`${style.img} ${fromMe? style.right: style.left}`}
                time={time}>
                {!loaded && <div className={`fill skeleton ${style.skeleton}`} />}
                <img
                    ref={imgRef}
                    style={{opacity:loaded?1:0}} loading="eager" alt=""
                    src={`${API.WS_URL}/${message.content}`}
                />
            </div>
        }
    </>
}
