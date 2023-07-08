/* import */
/* ======================================== */
/* CSS */
import style from "../Profile.module.css"
import Back from "../../../global/icon/Back"
/* Hooks */
import { useRef } from "react"
/* Function */
import InputChecker from "../../../global/functions/InputChecker"

/* ======================================== */
export default function InputPage({ isHandling, closePage, type, updateProfile }) {
    const inputRef = useRef()
    const title = (type === "nickname")?"輸入名稱": (type === "phone")? "輸入手機": "輸入信箱"
    
    async function submitHandler() {
        const value = inputRef.current.value
        const noBlank = InputChecker.noBlank(value)
        if (!noBlank) return
        updateProfile(type, value, closePage)
    }

    /* ==================== 分隔線 ==================== */
    return <>
        <div className="page">
            <header>
                <div className="flex_center">
                    <Back 
                        goLastPage={false}
                        closeSubPage={closePage}
                    />
                    <span>{title}</span>
                </div>
                <button className="icon-button" onClick={submitHandler} disabled={isHandling} >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="icon bi bi-check-lg" viewBox="0 0 16 16">
                        <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425a.247.247 0 0 1 .02-.022Z"/>
                    </svg>
                </button>
            </header>
            <main className="main" >
                <div className={style.container} style={{border:"0"}}>
                    <input type="text" ref={inputRef} placeholder="在這裡輸入" />
                </div>
            </main>
        </div>
    </>
}
