import API from "../API"

import React, { useContext } from "react"
import webSocket from "socket.io-client"

const socket = webSocket(API.WS_URL)
const SocketContext = React.createContext()
export const useSocket = () => useContext(SocketContext)

export default function SocketProvider({ children }) {
    return <>
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    </>
}

/* 前端要讓後端知道的動作
 *
 * 進來網頁: 加入 socket.io 但不要進房間 (房間最多2人 => 私訊)
 * 進來聊天: 還是不要進房間
 * 進入對話 (選擇特定人): 進房間
 * */

/* DB 何時加入聊天歷史紀錄
 * 房間內有人傳訊息: 將對話加到 DB，並且 broadcast 給房間的所有人 (這邊指另 1 個人)
 * */