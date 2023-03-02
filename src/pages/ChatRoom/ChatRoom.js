/* import */
/* ======================================== */
/* CSS */
import style from "./ChatRoom.module.css"
/* Components */
import PhotoViewer from "../../global/components/PhotoViewer"
/* header 的按鈕 */
import Back from "../../global/icon/Back"
/* API */
import API from "../../global/API"
/* Functions */
import InputChecker from "../../global/functions/InputChecker"
/* React Hooks */
import { useSocket } from "../../global/hooks/SocketProvider"
import { useState, useEffect, useRef } from "react"
import { useParams } from "react-router-dom"

/* ======================================== */
/* React Components */
const onMOBILE = (/Mobi|Android|iPhone/i.test(navigator.userAgent))
export default function ChatRoom() {
    const params = useParams()
    const receiver = params.receiver
    const provider = localStorage.getItem("account")
    const socket = useSocket()
    const textareaRef = useRef()
    const [fullscreen, setFullscreen] = useState("")
    const [messages, setMessages] = useState([])
    useEffect( () => {
        const body = document.body
        const bottomDistance = body.scrollHeight + body.getBoundingClientRect().y
        const toBottom = (bottomDistance < 1000 || messages?.at(-1)?.provider === provider)
        if (toBottom) window.scrollTo("top", body.clientHeight)
    }, [messages, provider])
    useEffect( () => {
        document.title = `對話 - ${receiver}`
        init()
        async function init() {
            const token = localStorage.getItem("token")
            const {success, history} = await API.post(API.CHATROOM, {token, receiver})
            if (!success) window.location.replace("/")
            setMessages(history || [])
        }
    }, [receiver])
    useEffect( () => {
        socket.on("message", messageHandler)
        function messageHandler(message) {
            const Isend = (message?.provider === provider && message?.receiver === receiver)
            const Usend = (message?.provider === receiver && message?.receiver === provider)
            if (Isend || Usend) setMessages( prev => [...prev, message])
        }
        return () => {
            socket.off("message", messageHandler)
        }
    }, [socket, provider, receiver])

    function sendMessage() {
        const type = "text"
        const content = textareaRef.current.value
        textareaRef.current.value = ""
        if (content.replaceAll('\n', '') === "") return
        socket.emit("message", {provider, receiver, type, content})
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
            if (! InputChecker.isImageFormat(fileData)) continue
            // const url = URL.createObjectURL(fileData)
            // setInputImgs(prev => [...prev, url])
            const reader = new FileReader()
            reader.readAsDataURL(fileData)
            reader.addEventListener("load", () => {
                const img = reader.result //base64Pic
                socket.emit("message", {provider, receiver, type, img})
            }, false)
        }
        e.target.value = "";
    }
    return <>
        <header>
            <div className="flex_center">
                <Back />
                <span>{receiver}</span>
            </div>
        </header>
        <main className="main">
            <PhotoViewer
                fullscreen={fullscreen}
                setFullscreen={setFullscreen}
            />
            <div className={style.container}>
                {
                    messages.map( (message, i) => 
                        <div key={i}>
                            {
                                ( parseInt(messages[i]?.date?.split("/")?.join("") || 0)
                                - parseInt(messages[i-1]?.date?.split("/")?.join("") || 0)
                                > 1 )
                                && <div className={style.date}>{message?.date || ""}</div>
                            }
                            {
                                (message?.type === "text") &&
                                <div
                                    className={`${style.card} ${message?.provider === provider? style.right: style.left}`}
                                    time={message?.time || ""}>
                                    {message?.content || "error"}
                                </div>
                            }
                            {
                                (message?.type === "img") &&
                                <div className={`${style.img} ${message?.provider === provider? style.right: style.left}`}
                                    time={message?.time || ""}
                                    onClick={ ()=>{setFullscreen(`${API.WS_URL}/${message?.src || ""}`)} }    
                                >
                                    
                                    <img src={`${API.WS_URL}/${message?.src || ""}`} alt="" />
                                </div>
                            }
                        </div>
                    )
                }
            </div>
        </main>
        <div className={style.base}></div>
        <div className={style.bottom}>
            <label className={style.button}>
                <input style={{ display: "none" }} type="file" accept=".png,.jpg,.jpeg,.gif" multiple 
                    onChange={onInputImgChange} />
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-plus-lg" viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2Z"/>
                </svg>
            </label>
            <textarea className={style.input} rows="3" wrap="soft"
                onKeyDown={onKeyDown} ref={textareaRef} />
            <button className={style.button} onClick={sendMessage} >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-send-fill" viewBox="0 0 16 16">
                    <path d="M15.964.686a.5.5 0 0 0-.65-.65L.767 5.855H.766l-.452.18a.5.5 0 0 0-.082.887l.41.26.001.002 4.995 3.178 3.178 4.995.002.002.26.41a.5.5 0 0 0 .886-.083l6-15Zm-1.833 1.89L6.637 10.07l-.215-.338a.5.5 0 0 0-.154-.154l-.338-.215 7.494-7.494 1.178-.471-.47 1.178Z"/>
                </svg>
            </button>
        </div>
    </>
}