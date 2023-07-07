/* import */
/* ======================================== */
/* API */
import API from "../../../API"
/* CSS */
import style from "../../Profile/Profile.module.css"
import Back from "../../../global/icon/Back"
/* Hooks */
import { useState, useRef } from "react"
/* Redux */
import { useSelector } from "react-redux"
/* Function */
import InputChecker from "../../../global/functions/InputChecker"

/* ======================================== */
export default function PasswordPage({ closePage }) {
    const pass1Ref = useRef()
    const pass2Ref = useRef()
    const pass3Ref = useRef()
    const {token} = useSelector(state => state.account)
    const [isHandling, setIsHandling] = useState(false)

    function submitHandler() {
        const oldPassword = pass1Ref.current.value
        const newPassword = pass2Ref.current.value
        const newPassword2 = pass3Ref.current.value
        const noBlack = InputChecker.noBlank(oldPassword, newPassword, newPassword2)
        if (newPassword !== newPassword2) alert("輸入密碼不相同")
        else if (!noBlack) return
        else changePassword({oldPassword, newPassword})
    }
    async function changePassword(payload) {
        setIsHandling(true)
        const {success, message} = await API.post(API.PASSWORD_CHANGE, token, payload)
        if (success) closePage()
        alert(message)
        setIsHandling(false)
    }
    
    /* ==================== 分隔線 ==================== */
    return <>
        {
            isHandling &&
            <div className="loading-ring" />
        }
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
                    <div>舊密碼</div>
                    <input type="password" ref={pass1Ref} />
                    <div>新密碼</div>
                    <input type="password" ref={pass2Ref} />
                    <div>確認密碼</div>
                    <input type="password" ref={pass3Ref} />
                </div>
            </main>
        </div>
    </>
}
