/* import */
/* ======================================== */
/* CSS */
import style from "./Option.module.css"
import { useState, useRef } from "react"
/* Components */
import Map from "./Map"

/* ======================================== */
export default function Option({ mode, value, setDecision, hideRadio, isHandling=false}) {
    const radioRef = useRef()
    const [showingMap, setShowingMap] = useState(false)

    const newDateTime = new Date(value).toLocaleString('zh-TW', {
        timeZone: 'Asia/Taipei', hourCycle: 'h23',
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
    })
    const datatime = (newDateTime !== "Invalid Date")? newDateTime: ""

    function radioClickHandler() {
        if (hideRadio || isHandling) return
        setDecision(prev => {
            return {
                ...prev,
                [mode] : value
            }
        })
    }
    function labelClickHandler() {
        if (hideRadio || isHandling) return
        radioRef.current.checked = true
        radioClickHandler()
    }

    /* ==================== 分隔線 ==================== */
    return <>
        {
            showingMap && 
            <Map 
                closePage = {() => {setShowingMap(false)}}
                destination = {value}
            />
        }
        <div className={style.option}>
            {
                !hideRadio &&
                <input type="radio" name={mode} ref={radioRef} 
                    onClick={radioClickHandler} disabled={isHandling} />
            }
            <label onClick={labelClickHandler}>
                {
                    (mode === "position")
                    ?<input type="text" className={style.position} disabled={true} value={value.name} />
                    :<input type="text" disabled={true} value={datatime} />
                }
            </label>
            {
                (mode === "position") &&
                <button className={style.icon} onClick={() => {setShowingMap(true)}}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="icon bi bi-geo-alt-fill" viewBox="0 0 16 16">
                        <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"/>
                    </svg>
                </button>
            }
        </div>
    </>
}
