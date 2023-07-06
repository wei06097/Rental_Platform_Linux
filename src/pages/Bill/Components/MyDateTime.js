/* import */
/* ======================================== */
/* CSS */
import style from "../Bill.module.css"
/* Hooks */
import { useState, useRef } from "react"

/* ======================================== */
export default function MyDateTime({ index, length, setDates, deleteHandler, isLoading }) {
    const datetimeRef = useRef()
    const [datetime, setDatetime] = useState("選擇日期與時間")
    function getDateTime() {
        setDates(prev => {
            const newDates = [...prev]
            const element = {...prev[index]}
            newDates[index] = {
                ...element,
                datetime : datetimeRef.current.value
            }
            return newDates
        })
        const newDateTime = new Date(datetimeRef.current.value).toLocaleString('zh-TW', {
            timeZone: 'Asia/Taipei', hourCycle: 'h23',
            day: '2-digit', month: '2-digit', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        })
        setDatetime((newDateTime==="Invalid Date")? "選擇日期與時間": newDateTime)
    }
    /* ==================== 分隔線 ==================== */
    return <>
        <div className={style.data}>
            <div>{datetime}</div>
            <input type="datetime-local" ref={datetimeRef} onChange={getDateTime} disabled={isLoading} />
            <button className={style.icon}
                style={{visibility:(length !== 1)? "visible":"hidden"}}
                onClick={deleteHandler}
                disabled={isLoading}
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="icon bi bi-dash-circle-fill" viewBox="0 0 16 16">
                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM4.5 7.5a.5.5 0 0 0 0 1h7a.5.5 0 0 0 0-1h-7z"/>
                </svg>
            </button>
        </div>
   </>
}
