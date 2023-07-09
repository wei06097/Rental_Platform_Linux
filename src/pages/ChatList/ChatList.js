/* import */
/* ======================================== */
/* CSS */
import style from "./ChatList.module.css"
/* API */
import API from "../../API"
/* Components */
import Back from "../../global/icon/Back"
/* Hooks */
import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
/* Redux */
import { useSelector } from "react-redux"

/* ======================================== */
export default function ChatList() {
    const navigate = useNavigate()
    const {token, isLogin} = useSelector(state => state.account)
    const [isLoading, setIsLoading] = useState(false)
    const [users, setUsers] = useState([])

    useEffect( () => {
        document.title = "聊天室"
        if (!isLogin) navigate("/SignIn", {replace : true})
    }, [navigate, isLogin])

    useEffect(() => {
        setIsLoading(true)
        init()
        async function init() {
            const {success, list} = await API.get(API.CHAT_OVERVIEW, token)
            if (success) setUsers(list)
            setIsLoading(false)
        }
    }, [token])

    /* ==================== 分隔線 ==================== */
    return <>
        <header>
            <div className="flex_center">
                <Back />
                <span>聊天室</span>
            </div>
        </header>
        <main className="main">
            {
                isLoading?
                <div className="loading-ring" />:
                users && users
                    .map(user => 
                        <Link key={user.id} className={`link ${style.card}`} to={`/ChatRoom/${user.account}`}>
                            <div className={style.img} />
                            <div className={style.content} time={user.datetime.slice().split("T")[1]}>
                                <div>{user.nickname}</div>
                                <div>{user.content}</div>
                            </div>
                        </Link>
                    )
            }
        </main>
    </>
}
