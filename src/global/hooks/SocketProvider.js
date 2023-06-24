import API from "../../API"

import React, { useContext } from "react"
import webSocket from "socket.io-client"

const socket = webSocket(API.WS_URL)
const SocketContext = React.createContext()
export const useSocket = () => useContext(SocketContext)

export default function SocketProvider({ children }) {
    // 自動偵測localStorage
    window.addEventListener("storage", (event) => {
        const isLogout = event.key === "token" && !event.newValue
        // 為了讓socket重新連線，必須重新整理
        if (isLogout) window.location.reload()
    })
    socket.on('connect', () => {
        const token = localStorage.getItem("token")
        const account = localStorage.getItem("account")
        if (!token && !account) return
        socket.emit("login", token, account)
    })
    return <>
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    </>
}