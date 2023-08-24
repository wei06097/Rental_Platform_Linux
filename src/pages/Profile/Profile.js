/* import */
/* ======================================== */
/* API */
import API from "../../API"
/* CSS */
import style from "./Profile.module.css"
/* Components */
import Back from "../../global/icon/Back"
import Home from "../../global/icon/Home"
import Item from "./components/Item"
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

    useEffect( () => {
        document.title = "個人檔案"
        if (!isLogin) navigate("/SignIn", {replace : true})
    }, [navigate, isLogin])
    useEffect( () => {
        init()
        async function init() {
            const {success, data} = await API.get(API.PROFILE, token)
            if (success) setProfile(data)
            setIsHandling(false)
        }
    }, [token])

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

    /* ==================== 分隔線 ==================== */
    return <>
        <header>
            <div className="flex_center">
                <Back />
                <span>個人檔案</span>
            </div>
            <div className="flex_center">
                <Home />
            </div>
        </header>
        <main className="main">
            {
                isHandling &&
                <div className="loading-ring" />
            }
            <div className={style.container}>
                <div>帳號</div>
                <Item
                    isEditable={false}
                    value={profile?.account || ""}
                />
                <div>名稱</div>
                <Item
                    isHandling={isHandling}
                    value={profile?.nickname || ""}
                    type={"nickname"}
                    updateProfile={updateProfile}
                />
                <div>賣場簡介</div>
                <Item
                    isHandling={isHandling}
                    value={profile?.intro || ""}
                    type={"intro"}
                    updateProfile={updateProfile}
                />
                <div>手機</div>
                <Item
                    isHandling={isHandling}
                    needVerify={false}
                    value={profile?.phone || ""}
                    type={"phone"}
                    updateProfile={updateProfile}
                />
                <div>信箱</div>
                <Item
                    isHandling={isHandling}
                    needVerify={false}
                    value={profile?.mail || ""}
                    type={"mail"}
                    updateProfile={updateProfile}
                />
            </div>
        </main>
    </>
}
