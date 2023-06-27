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
    
    useEffect(() => {
        // 登出了但還沒斷線
        if (!token && socket) setSocket(null)
    }, [token, socket])

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
