import API from "../API"

import React, { useContext } from "react"
import webSocket from "socket.io-client"

const socket = webSocket(API.WS_URL)
const SocketContext = React.createContext()
export const useSocket = () => useContext(SocketContext)

export default function SocketProvider({ children }) {
    // 自動偵測localStorage的token，如果沒有token就重新載入(socket會重新連線)
    window.addEventListener("storage", (event) => {
        const isLogout = event.key === "token" && !event.newValue
        if (isLogout) window.location.reload()
    })
    const token = localStorage.getItem("token")
    const account = localStorage.getItem("account")
    if (token && account) socket.emit("login", token, account)

    return <>
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    </>
}