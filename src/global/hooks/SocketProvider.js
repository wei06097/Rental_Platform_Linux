/* import */
/* ======================================== */
/* API */
import API from "../../API"
/* socket */
import React, { useState, useEffect, useContext } from "react"
import webSocket from "socket.io-client"
/* Redux */
import { useSelector } from "react-redux"

const SocketContext = React.createContext()
export const useSocket = () => useContext(SocketContext)
/* ======================================== */
export default function SocketProvider({ children }) {
    const [socket, setSocket] = useState(null)
    const {token} = useSelector(state => state.account)
    
    /* 獲取瀏覽器通知權限 */
    useEffect(() => {
        function requestNotifyPermission() {
            window.removeEventListener("mousemove", requestNotifyPermission)
            if (!("Notification" in window)) {
                console.log('This browser does not support notification')
            } else {
                Notification.requestPermission()
                    .then((permission) => {
                        // permission: 1. granted 2.denied 3.default
                        const config = {
                            body: `Notification is ${permission}`,
                            tag: "permission"
                        }
                        new Notification("Notification", config)
                    })
            }
        }
        window.addEventListener("mousemove", requestNotifyPermission)
        return () => {
            window.removeEventListener("mousemove", requestNotifyPermission)
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

    /* 簡單測試socket */
    useEffect(() => {
        if (!socket) return
        socket.on("connect", () => {
            console.log("socket 已連線", socket)
            // console.log("token:", socket._opts.extraHeaders.Authorization)
        })
        return () => {
            socket.off("connect")
            console.log("socket 已斷線")
        }
    }, [socket])

    /* ==================== 分隔線 ==================== */
    return <>
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    </>
}
