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
import { useSocket } from "../../global/hooks/SocketProvider"
/* Redux */
import { useSelector } from "react-redux"
/* Else */
import { v4 as uuidv4 } from "uuid"

/* ======================================== */
export default function ChatList() {
    const socket = useSocket()
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
            if (success) setUsers(list.map(element => {return {...element, key:uuidv4()}}))
            setIsLoading(false)
        }
    }, [token])

    useEffect(() => {
        if (!socket) return
        socket.addEventListener("message", messageEventHandler)
        function messageEventHandler(event) {
            const message = JSON.parse(event.data)
            if (message.event !== "chat") return
            const chat = message.payload
            setUsers(prev => {
                const lastList = prev
                    .filter(element => element.account === chat.provider)
                let newList = prev
                    .filter(element => element.account !== chat.provider)
                newList = [{
                    account : chat.provider,
                    content : chat.message_type === "text"? chat.content: "傳送了一張圖片",
                    datetime : chat.datetime,
                    nickname : chat.nickname,
                    number : lastList[0]?.number + 1 || 1,
                    key : uuidv4()
                }, ...newList]
                return newList
            })
        }
        return () => {
            socket.removeEventListener("message", messageEventHandler)
        }
    }, [socket])

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
                        <Link key={user.key} to={`/ChatRoom/${user.account}`}
                            className={`link ${style.card} ${user.number>0 && style.number}`} 
                            number={user.number>99? 99: user.number}
                        >
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
