/* import */
/* ======================================== */
/* Redux */
import { useSelector } from "react-redux"
/* Hooks */
import React, { useState, useEffect, useContext } from "react"

const SocketContext = React.createContext()
export const useSocket = () => useContext(SocketContext)

/* ======================================== */
export default function SocketProvider({ children }) {
    const [socket, setSocket] = useState(null)
    const {token, account} = useSelector(state => state.account)

    /* 登入後要socket連線 */
    useEffect(() => {
        if (!token) return
        const WS_URL = process.env.REACT_APP_WS_URL
        const newSocket = new WebSocket(WS_URL, ["Authorization", token])
        newSocket.addEventListener("open", () => {
            setSocket(newSocket)
        })
        return () => {
            newSocket.close()
        }
    }, [token])
    /* 登出後要清除socket */
    useEffect(() => {
        if (!token && socket) setSocket(null)
    }, [token, socket])

    /* 獲取瀏覽器通知權限 */
    useEffect(() => {
        if (!("Notification" in window)) {
            console.log('This browser does not support notification')
        } else {
            Notification.requestPermission()
        }
    }, [])
    /* 訂單或是訊息事件監聽 */
    useEffect(() => {
        if (!socket) return
        function messageNotify({ provider, receiver, message_type, content, nickname }) {
            if (account !== receiver) return
            const notify = new Notification(nickname, {
                body: (message_type === "img")? "傳送了一張圖片": content,
                tag: `message-${provider}`
            })
            notify.onclick = () => {
                const myWindow = window.open(`/#/ChatRoom/${provider}`," _blank")
                myWindow.focus()
                notify.close()
            }
        }
        function orderNotify(order) {
            const {id, message} = order
            const notify = new Notification("訂單通知", {
                body: message,
                tag: `order-${id}`
            })
            notify.onclick = () => {
                const myWindow = window.open(`/#/OrderDetail/${id}`," _blank")
                myWindow.focus()
                notify.close()
            }
        }
        function messageEventHandler(event) {
            const message = JSON.parse(event.data)
            if (message.event === "chat") {
                messageNotify(message.payload)
            } else if (message.event === "order") {
                orderNotify(message.payload)
            }
        }
        socket.addEventListener("message", messageEventHandler)
        return () => {
            socket.removeEventListener("message", messageEventHandler)
        }
    }, [socket, account])
    
    /* ==================== 分隔線 ==================== */
    return <>
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    </>
}
