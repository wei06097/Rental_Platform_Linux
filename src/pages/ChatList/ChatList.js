/* import */
/* ======================================== */
/* CSS */
import style from "./ChatList.module.css"
/* API */
import API from "../../global/API"
/* header 的按鈕 */
import Back from "../../global/icon/Back"
/* React Hooks */
import { useState, useEffect } from "react"
import { Link } from "react-router-dom"

/* ======================================== */
/* React Components */
export default function ChatList() {
    const [users, setUsers] = useState([])
    useEffect( () => {
        document.title = "聊天室"
        init()
        async function init() {
            const token = localStorage.getItem("token")
            const {success, list} = await API.get(API.CHAT_LIST, token)
            if (!success) alert("尚未登入")
            else setUsers(list || [])
        }
    }, [])
    return <>
        <header>
            <div className="flex_center">
                <Back />
                <span>聊天室</span>
            </div>
        </header>
        <main className="main">
            {
                users.map( (user, i) => 
                    <Link
                        key={i}
                        className={style.card}
                        to={`/ChatRoom/${user?.account}`}>
                        <div className={style.img}></div>
                        <div className={style.content} time={"04:44"}>
                            <div>{user?.account}</div>
                            <div>{`暫時不顯示內容\n暫時不顯示內容\n暫時不顯示內容`}</div>
                        </div>
                    </Link>
                )
            }
        </main>
    </>
}