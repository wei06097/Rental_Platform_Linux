/* import */
/* ======================================== */
/* API */
import API from "../../API"
/* CSS */
import style from "./Message.module.css"
/* Components */
import ViewPage from "./ViewPage"
/* Hooks */
import { useState, useEffect, useRef } from "react"

/* ======================================== */
export default function Message({ message, fromMe, startHere, setMyScroll }) {
    const readRef = useRef()
    const imgRef = useRef()
    const [loaded, setLoaded] = useState(false)
    const [opening, setOpening] = useState(false)
    const [date, time] = message.datetime.slice().split("T")
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const days = (new Date(message.datetime) - new Date(today)) / (24 * 3600 * 1000)
    const string = (days > 0)? "今天": (days > -1)? "昨天": date
    
    useEffect(() => {
        autoScroll()
        if (message.message_type === "text") return
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
    useEffect(() => {
        if (!fromMe && startHere && readRef) {
            setTimeout(() => {
                const scrollY = readRef.current?.offsetTop - 80
                window.scrollTo({ top: scrollY })
            }, 100)
        }
    }, [startHere, fromMe])

    /* ==================== 分隔線 ==================== */
    return <>
        {
            !fromMe && startHere &&
            <div className={style.date} ref={readRef}>未讀訊息</div>
        }
        {
            message.showString &&
            <div className={style.date}>{string}</div>
        }
        {
            (message.message_type === "text")?
            <div className={`${style.card} ${fromMe? style.right: style.left}`}
                time={time}>
                {message.content}
            </div>:
            <div className={`${style.img} ${fromMe? style.right: style.left}`}
                time={time}>
                {!loaded && <div className={`fill skeleton ${style.skeleton}`} />}
                <img onClick={() => {setOpening(true)}}
                    ref={imgRef}
                    style={{opacity:loaded?1:0}} loading="eager" alt=""
                    src={`${API.WS_URL}/${message.content}`}
                />
            </div>
        }
        {
            opening &&
            <ViewPage
                closePage={() => {setOpening(false)}}
                src={`${API.WS_URL}/${message.content}`}
            />
        }
    </>
}
