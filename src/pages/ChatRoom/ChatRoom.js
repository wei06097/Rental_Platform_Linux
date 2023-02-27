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
async function checkReceiver(body) {
    const response = await fetch(API.CHATROOM, {
        method : "POST",
        headers : { "Content-Type" : "application/json" },
        body : JSON.stringify(body)
    })
    const result = await response.json()
    return Promise.resolve(result?.success || false)
}
function fetchMessage() {
    return [
        {
            me: true,
            type: "text",
            content: "你好",
            date: "2021/02/02",
            time: "17:05"
        },
        {
            me: false,
            type: "text",
            content: "hello",
            date: "2022/02/02",
            time: "17:06"
        },
        {
            me: false,
            type: "text",
            content: "hello",
            date: "2022/02/05",
            time: "17:07"
        }
    ]
}

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
        if (bottomDistance < 1000) window.scrollTo("top", body.clientHeight)
        else if (messages?.at(-1)?.me) window.scrollTo("top", body.clientHeight)
    }, [messages])
    useEffect( () => {
        init()
        document.title = `${receiver} - 聊天室`
        setMessages(fetchMessage())
        async function init() {
            const isExist = await checkReceiver( {receiver} )
            if (!isExist) window.location.replace("/")
        }
    }, [receiver])
    useEffect( () => {
        socket.on("message", messageHandler)
        function messageHandler(message) {
            const visibile = (message?.provider === provider || message?.provider === receiver)
            if (!visibile) return
            const me = message?.provider === provider
            setMessages( prev => [...prev, {
                me: me,
                type: message?.type,
                content: message?.content,
                date: message?.date,
                time: message?.time,
            }])
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
        const length = e.target.files.length
        for (let i=0; i<length; i++) {
            const fileData = e.target.files[i]
            if (! InputChecker.isImageFormat(fileData)) continue
            // const url = URL.createObjectURL(fileData)
            // setInputImgs(prev => [...prev, url])
            const reader = new FileReader()
            reader.readAsDataURL(fileData)
            reader.addEventListener("load", () => {
                const base64Pic = reader.result
                const current = new Date().toLocaleString('zh-TW', {
                    timeZone: 'Asia/Taipei', hour12: false,
                    day: '2-digit', month: '2-digit', year: 'numeric',
                    hour: '2-digit', minute: '2-digit'
                })
                const [date, time] = current.split(" ")
                setMessages( prev => [...prev, {
                    me: true,
                    type: "img",
                    src: base64Pic,
                    date: date,
                    time: time,
                }])
            }, false)
        }
        e.target.value = "";
    }
    return <>
        <header>
            <div className="flex_center">
                <Back />
                <span>小杏</span>
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
                                    className={`${style.card} ${message?.me === true? style.right: style.left}`}
                                    time={message?.time || ""}>
                                    {message?.content || "error"}
                                </div>
                            }
                            {
                                (message?.type === "img") &&
                                <div className={`${style.img} ${message?.me === true? style.right: style.left}`}
                                    time={message?.time || ""}
                                    onClick={ ()=>{setFullscreen(message?.src || "")} }    
                                >
                                    <img src={message?.src || ""} alt="" />
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