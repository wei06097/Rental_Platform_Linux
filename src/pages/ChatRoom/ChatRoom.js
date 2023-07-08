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

    // 拿歷史紀錄
    useEffect(() => {
        document.title = `對話 : ${receiver}`
        if (!isLogin) navigate("/SignIn", {replace : true})
        init()
        async function init() {
            const {success, history} = await API.get(`${API.CHAT_HISTORY}/?receiver=${receiver}`, token)
            if (!success) return
            const newHistory = history
                .map(element => {
                    return {...element, key : uuidv4()}
                })
            setMessages(newHistory)
        }
    }, [navigate, isLogin, token, receiver])
     // 及時訊息接收
    useEffect(() => {
        if (!socket) return
        socket.on("message", messageHandler)
        function messageHandler(message) {
            const Isend = (message.provider === account && message.receiver === receiver)
            const Usend = (message.provider === receiver && message.receiver === account)
            if (Isend || Usend) {
                const newMessage = {...message, key : uuidv4()}
                setMessages(prev => [...prev, newMessage])
            }
        }
        return () => {
            socket.off("message", messageHandler)
        }
    }, [socket, account, receiver])
    
    /* ==================== 分隔線 ==================== */
    function sendMessage() {
        const type = "text"
        const content = textareaRef.current.innerText
        textareaRef.current.innerText = ""
        if (content.replaceAll('\n', '') === "") return
        if (socket) socket.emit("message", {provider: account, receiver, type, content})
    }
    function onKeyDown(e) {
        const keyCode = e.which || e.keyCode
        const PC_Enter = (keyCode === 13 && !e.shiftKey)
        if (onMOBILE || !PC_Enter) return
        e.preventDefault()
        sendMessage()
    }
    function onInputImgChange(e) {
        const type = "img"
        const length = e.target.files.length
        for (let i=0; i<length; i++) {
            const fileData = e.target.files[i]
            if (!InputChecker.isImageFormat(fileData)) continue
            const reader = new FileReader()
            reader.readAsDataURL(fileData)
            reader.addEventListener("load", () => {
                const content = reader.result //base64Pic
                if (socket) socket.emit("message", {provider: account, receiver, type, content})
            }, false)
        }
    }

    /* ==================== 分隔線 ==================== */
    return <>
        <header>
            <div className="flex_center">
                <Back />
                <span>{receiver}</span>
            </div>
        </header>
        <main className="main">
            <div className={style.container}>
                {
                    messages
                        .map((message, i) => 
                            <Message
                                key={message.key}
                                lastDateTime={i!==0? messages[i-1].datetime: 0}
                                message={message}
                                fromMe={message.provider === account}
                            />
                        )
                }
            </div>
        </main>
        <div className={style.base} />
        <div className={style.bottom}>
            <label className={style.button}>
                <input style={{ display: "none" }} type="file" accept=".png,.jpg,.jpeg,.gif" multiple 
                    onChange={onInputImgChange} />
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="icon bi bi-plus-lg" viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2Z"/>
                </svg>
            </label>
            <div className={style.test_box} suppressContentEditableWarning={true}
                contentEditable={true} onKeyDown={onKeyDown} ref={textareaRef} />
            <button className={style.button} onClick={sendMessage} >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="icon bi bi-send-fill" viewBox="0 0 16 16">
                    <path d="M15.964.686a.5.5 0 0 0-.65-.65L.767 5.855H.766l-.452.18a.5.5 0 0 0-.082.887l.41.26.001.002 4.995 3.178 3.178 4.995.002.002.26.41a.5.5 0 0 0 .886-.083l6-15Zm-1.833 1.89L6.637 10.07l-.215-.338a.5.5 0 0 0-.154-.154l-.338-.215 7.494-7.494 1.178-.471-.47 1.178Z"/>
                </svg>
            </button>
        </div>
    </>
}
