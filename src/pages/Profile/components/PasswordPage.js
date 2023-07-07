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
export default function PasswordPage({ isHandling, closePage, changePassword }) {
    const pass1Ref = useRef()
    const pass2Ref = useRef()
    const pass3Ref = useRef()

    function submitHandler() {
        const oldPassword = pass1Ref.current.value
        const newPassword = pass2Ref.current.value
        const newPassword2 = pass3Ref.current.value
        const noBlack = InputChecker.noBlank(oldPassword, newPassword, newPassword2)
        if (newPassword !== newPassword2) alert("輸入密碼不相同")
        else if (!noBlack) return
        else changePassword({oldPassword, newPassword}, closePage)
    }
    
    /* ==================== 分隔線 ==================== */
    return <>
        <div className={style.page}>
            <header>
                <div className="flex_center">
                    <Back 
                        goLastPage={false}
                        closeSubPage={closePage}
                    />
                    <span>變更密碼</span>
                </div>
                <button className="icon-button" disabled={isHandling} onClick={submitHandler} >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="icon bi bi-check-lg" viewBox="0 0 16 16">
                        <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425a.247.247 0 0 1 .02-.022Z"/>
                    </svg>
                </button>
            </header>
            <main className="main" >
                <div className={style.container}>
                    <div className={style.title}>舊密碼</div>
                    <input type="password" ref={pass1Ref} />
                    <div className={style.title}>新密碼</div>
                    <input type="password" ref={pass2Ref} />
                    <div className={style.title}>確認密碼</div>
                    <input type="password" ref={pass3Ref} />
                </div>
            </main>
        </div>
    </>
}
