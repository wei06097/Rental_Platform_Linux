/* import */
/* ======================================== */
/* API */
import API from "../../API"
/* Redux */
import { useSelector } from "react-redux"
/* socket */
import React, { useState, useEffect, useContext } from "react"
import webSocket from "socket.io-client"

const SocketContext = React.createContext()
export const useSocket = () => useContext(SocketContext)

/* ======================================== */
export default function SocketProvider({ children }) {
    const [socket, setSocket] = useState(null)
    const {token, account} = useSelector(state => state.account)
    
    /* 獲取瀏覽器通知權限 */
    useEffect(() => {
        if (!("Notification" in window)) {
            console.log('This browser does not support notification')
        } else {
            // permission: 1. granted 2.denied 3.default
            // Notification.requestPermission()
            //     .then(permission => {
            //         console.log(`notification permission ${permission}`)
            //     })
        }
    }, [])

    /* 登入後要socket連線 */
    useEffect(() => {
        if (!token) return
        const newSocket = webSocket(API.WS_URL, {
            extraHeaders : {
                "Authorization": token
            }
        })
        setSocket(newSocket)
        return () => {
            newSocket.close()
        }
    }, [token])
    /* 登出後要清除socket */
    useEffect(() => {
        if (!token && socket) setSocket(null)
    }, [token, socket])

    /* 訂單或是訊息事件監聽 */
    useEffect(() => {
        if (!socket) return
        function messageNotify(message) {
            const {provider, receiver, type, content, nickname} = message
            if (provider === account || receiver !== account) return
            const notify = new Notification(nickname, {
                body: (type === "img")? "傳送了一張圖片": content,
                tag: `message-${provider}`
            })
            notify.onclick = () => {
                const myWindow = window.open(`/ChatRoom/${provider}`," _blank")
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
                const myWindow = window.open(`/OrderDetail/${id}`," _blank")
                myWindow.focus()
                notify.close()
            }
        }
        socket.on("order", orderNotify)
        socket.on("message", messageNotify)
        return () => {
            socket.off("order", orderNotify)
            socket.off("message", messageNotify)
        }
    }, [socket, account])

    /* ==================== 分隔線 ==================== */
    return <>
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    </>
}
