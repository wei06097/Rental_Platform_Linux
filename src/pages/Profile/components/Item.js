/* import */
/* ======================================== */
/* CSS */
import style from "../Profile.module.css"
/* Hooks */
import { useState } from "react"
/* Components */
import InputPage from "./InputPage"
import TextAreaPage from "./TextAreaPage"

/* ======================================== */
export default function Item({ isHandling, isEditable=true, needVerify=false, value, type, updateProfile }) {
    const [showingPage, setShowingPage] = useState(false)
    
    function onClickHandler() {
        if (!isEditable || isHandling || needVerify) return
        setShowingPage(true)
    }

    /* ==================== 分隔線 ==================== */
    return <>
        {
            showingPage && type === "intro" &&
            <TextAreaPage
                isHandling={isHandling}
                closePage={() => setShowingPage(false)}
                type={type}
                updateProfile={updateProfile}
                defaultValue={value}
            />
        }
        {
            showingPage && type !== "intro" &&
            <InputPage 
                isHandling={isHandling}
                closePage={() => setShowingPage(false)}
                type={type}
                updateProfile={updateProfile}
                defaultValue={value}
            />
        }
        <div className={style.item} >
            <div onClick={onClickHandler}>{value}</div>
            {
                isEditable &&
                <svg onClick={onClickHandler}
                    xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pen" viewBox="0 0 16 16">
                    <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001zm-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708l-1.585-1.585z"/>
                </svg>
            }
        </div>
    </>
}
