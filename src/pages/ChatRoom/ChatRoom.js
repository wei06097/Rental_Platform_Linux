/* import */
/* ======================================== */
/* CSS */
import style from "./ChatRoom.module.css"
/* API */
import API from "../../API"
/* Functions */
import InputChecker from "../../global/functions/InputChecker"
/* Components */
import Back from "../../global/icon/Back"
import Message from "./Message"
/* Hooks */
import { useSocket } from "../../global/hooks/SocketProvider"
import { useState, useEffect, useRef } from "react"
import { useParams, useNavigate } from "react-router-dom"
/* Redux */
import { useSelector } from "react-redux"
/* Else */
import { v4 as uuidv4 } from "uuid"

/* ======================================== */
export default function ChatRoom() {
    const onMOBILE = (/Mobi|Android|iPhone/i.test(navigator.userAgent))
    const {receiver} = useParams()
    const socket = useSocket()
    const navigate = useNavigate()
    const {account, token, isLogin} = useSelector(state => state.account)
    const textareaRef = useRef()
    const [messages, setMessages] = useState([])
    const [nickname, setNickname] = useState("")
    const [isLoading, setIsLoading] = useState(true)

    // 拿歷史紀錄
    useEffect(() => {
        document.title = "對話"
        if (!isLogin) navigate("/SignIn", {replace : true})
        init()
        async function init() {
            const {success, history, nickname} = await API.get(`${API.CHAT_HISTORY}?receiver=${receiver}`, token)
            if (!success) navigate("/NotFound", {replace : true})
            let lastdate = ""
            const newHistory = history
                .map(element => {
                    const date = element.datetime.split("T")[0]
                    const showString = (date !== lastdate)
                    lastdate = date
                    return {...element, showString, key : uuidv4()}
                })
            setMessages(newHistory)
            setNickname(nickname)
            document.title = `對話 : ${nickname}`
            setIsLoading(false)
        }
    }, [navigate, isLogin, token, receiver])
     // 及時訊息接收
    useEffect(() => {
        if (!socket) return
        socket.addEventListener("message", messageEventHandler)
        async function messageEventHandler(event) {
            const message = JSON.parse(event.data)
            if (message.event !== "chat") return
            const chat = message.payload
            const Isend = (chat.provider === account && chat.receiver === receiver)
            const Usend = (chat.provider === receiver && chat.receiver === account)
            if (Isend || Usend) {
                const newMessage = {...chat, key : uuidv4()}
                setMessages(prev => [...prev, newMessage])
            }
            if (Usend) {
                await API.put(`${API.CHAT_NOTIFY}?receiver=${receiver}`, token)
            }
        }
        return () => {
            socket.removeEventListener("message", messageEventHandler)
        }
    }, [socket, token, account, receiver])
    
    /* ==================== 分隔線 ==================== */
    function sendMessage() {
        const message_type = "text"
        const content = textareaRef.current.innerText
        textareaRef.current.innerText = ""
        if (content.replaceAll('\n', '') === "") return
        const payload = { event: "chat", payload: {receiver, message_type, content} }
        if (socket) socket.send(JSON.stringify(payload))
    }
    function onKeyDown(e) {
        const keyCode = e.which || e.keyCode
        const PC_Enter = (keyCode === 13 && !e.shiftKey)
        if (onMOBILE || !PC_Enter) return
        e.preventDefault()
        sendMessage()
    }
    function onInputImgChange(e) {
        const message_type = "img"
        const length = e.target.files.length
        for (let i=0; i<length; i++) {
            const fileData = e.target.files[i]
            if (!InputChecker.isImageFormat(fileData)) continue
            const reader = new FileReader()
            reader.readAsDataURL(fileData)
            reader.addEventListener("load", () => {
                const content = reader.result //base64Pic
                const payload = { event: "chat", payload: {receiver, message_type, content} }
                if (socket) socket.send(JSON.stringify(payload))
            }, false)
        }
        e.target.value = ""
    }

    /* ==================== 分隔線 ==================== */
    return <>
        <header>
            <div className="flex_center">
                <Back />
                <span>{nickname}</span>
            </div>
        </header>
        <main className="main">
            {
                isLoading?
                <div className="loading-ring" />:
                <div className={style.container}>
                    {
                        messages
                            .map((message, i) => 
                                <Message
                                    key={message.key}
                                    message={message}
                                    fromMe={message.provider === account}
                                    startHere={message.read===false && (i===0? true: messages[i-1].read)}
                                />
                            )
                    }
                </div>
            }
        </main>
        <div className={style.base} />
        <div className={style.bottom}>
            <label className={style.button}>
                <input style={{display: "none"}} type="file" accept="image/*" multiple 
                    onChange={onInputImgChange} disabled={isLoading} />
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="icon bi bi-images" viewBox="0 0 16 16">
                        <path d="M4.502 9a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z"/>
                        <path d="M14.002 13a2 2 0 0 1-2 2h-10a2 2 0 0 1-2-2V5A2 2 0 0 1 2 3a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v8a2 2 0 0 1-1.998 2zM14 2H4a1 1 0 0 0-1 1h9.002a2 2 0 0 1 2 2v7A1 1 0 0 0 15 11V3a1 1 0 0 0-1-1zM2.002 4a1 1 0 0 0-1 1v8l2.646-2.354a.5.5 0 0 1 .63-.062l2.66 1.773 3.71-3.71a.5.5 0 0 1 .577-.094l1.777 1.947V5a1 1 0 0 0-1-1h-10z"/>
                    </svg>
            </label>
            <div className={style.test_box} suppressContentEditableWarning={true}
                contentEditable={!isLoading} onKeyDown={onKeyDown} ref={textareaRef} />
            <button className={style.button} onClick={sendMessage} disabled={isLoading} >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="icon bi bi-send-fill" viewBox="0 0 16 16">
                    <path d="M15.964.686a.5.5 0 0 0-.65-.65L.767 5.855H.766l-.452.18a.5.5 0 0 0-.082.887l.41.26.001.002 4.995 3.178 3.178 4.995.002.002.26.41a.5.5 0 0 0 .886-.083l6-15Zm-1.833 1.89L6.637 10.07l-.215-.338a.5.5 0 0 0-.154-.154l-.338-.215 7.494-7.494 1.178-.471-.47 1.178Z"/>
                </svg>
            </button>
        </div>
    </>
}
