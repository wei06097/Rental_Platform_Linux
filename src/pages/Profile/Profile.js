/* import */
/* ======================================== */
/* API */
import API from "../../API"
/* CSS */
import style from "./Profile.module.css"
/* Components */
import Back from "../../global/icon/Back"
import Item from "./components/Item"
import PasswordPage from "./components/PasswordPage"
/* Hooks */
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
/* Redux */
import { useSelector } from "react-redux"

/* ======================================== */
export default function Profile() {
    const navigate = useNavigate()
    const {token, isLogin} = useSelector(state => state.account)
    const [profile, setProfile] = useState({})
    const [isHandling, setIsHandling] = useState(true)
    const [isSettingPass, setIsSettingPass] = useState(false)

    useEffect( () => {
        document.title = "個人檔案"
        if (!isLogin) navigate("/SignIn", {replace : true})
    }, [navigate, isLogin])
    useEffect( () => {
        init()
        async function init() {
            const {success, profile} = await API.get(API.PROFILE, token)
            if (success) setProfile(profile)
            setIsHandling(false)
        }
    }, [token])

    /* ======================================== */
    async function updateProfile(type, value, callback) {
        setIsHandling(true)
        const {success} = await API.put(API.PROFILE, token, {[type] : value})
        if (!success) return
        setProfile(prev => {
            return {
                ...prev,
                [type] : value
            }
        })
        callback()
        setIsHandling(false)
    }
    async function changePassword(payload, callback) {
        setIsHandling(true)
        const {success, message} = await API.post(API.PASSWORD_CHANGE, token, payload)
        if (success) callback()
        setIsHandling(false)
        alert(message)
    }

    /* ==================== 分隔線 ==================== */
    return <>
        <header>
            <div className="flex_center">
                <Back />
                <span>個人檔案</span>
            </div>
        </header>
        {
            isSettingPass &&
            <PasswordPage
                isHandling={isHandling}
                closePage={() => {setIsSettingPass(false)}}
                changePassword={changePassword}
            />
        }
        <main className="main">
            {
                isHandling &&
                <div className="loading-ring" />
            }
            <div className={style.container}>
                <div className={style.title}>帳號</div>
                <Item
                    isEditable={false}
                    value={profile?.account || ""}
                />
                <div className={style.title}>名稱</div>
                <Item
                    isHandling={isHandling}
                    value={profile?.nickname || ""}
                    type={"nickname"}
                    updateProfile={updateProfile}
                />
                <div className={style.title}>手機</div>
                <Item
                    isHandling={isHandling}
                    needVerify={false}
                    value={profile?.phone || ""}
                    type={"phone"}
                    updateProfile={updateProfile}
                />
                <div className={style.title}>信箱</div>
                <Item
                    isHandling={isHandling}
                    needVerify={false}
                    value={profile?.mail || ""}
                    type={"mail"}
                    updateProfile={updateProfile}
                />
            </div>
            <div className={style.container} style={{border:"0", margin:"0 auto", padding:"0"}}>
                <button className="button" disabled={isHandling} 
                    onClick={() => {setIsSettingPass(true)}}>變更密碼</button>
            </div>
        </main>
    </>
}
