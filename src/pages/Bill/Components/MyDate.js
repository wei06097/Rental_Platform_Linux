/* import */
/* ======================================== */
/* CSS */
import style from "../Bill.module.css"
/* Hooks */
import { useRef } from "react"

/* ======================================== */
export default function MyDate({ index, length, setDates, deleteHandler, isLoading }) {
    const dateRef = useRef()
    const timeRef = useRef()
    function getDateTime() {
        setDates(prev => {
            const newDates = [...prev]
            const element = {...prev[index]}
            newDates[index] = {
                ...element,
                date : dateRef.current.value,
                time : timeRef.current.value
            }
            return newDates
        })
    }
    /* ==================== 分隔線 ==================== */
    return <>
        <div className={style.data}>
            <input type="date" ref={dateRef} onChange={getDateTime} disabled={isLoading} />
            <input type="time" ref={timeRef} onChange={getDateTime} disabled={isLoading} />
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
