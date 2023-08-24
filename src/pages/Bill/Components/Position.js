/* import */
/* ======================================== */
/* CSS */
import style from "../Bill.module.css"
/* Components */
import Map from "./Map"
/* Hooks */
import { useState } from "react"

/* ======================================== */
export default function Position({ index, length, setDates, deleteHandler, isLoading }) {
    const [showingMap, setShowingMap] = useState(false)
    const [location, setLocation] = useState({center:[0, 0], name:""})
    function onChangeHandler(location) {
        setLocation(location)
        setDates(prev => {
            const newPosions = [...prev]
            newPosions[index].position = {...location}
            return newPosions
        })
    }
    /* ==================== 分隔線 ==================== */
    return <>
        {
            showingMap &&
            <Map 
                closePage = {() => {setShowingMap(false)}}
                setLocation = {onChangeHandler}
                location = {location}
            />
        }
        <div className={style.data}>
            <div className={style.position} onClick={() => {setShowingMap(true)}}>
                {location?.name || "選擇地點"}
            </div>
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
