/* CSS */
import style from "./ChatRoom.module.css"

/* Components */
import PhotoViewer from "../../global/components/PhotoViewer"

/* header 的按鈕 */
import Back from "../../global/icon/Back"

/* React Hooks */
import { useState, useEffect, useRef } from "react"

/* Functions */
import isImageFormat from "../../global/js/isImageFormat"

function getCurrentTime() {
    const date = new Date()
    const fillzero = (time) => time?.toString()?.padStart(2, '0') || "" 
    const DATE = `${date.getFullYear()}-${fillzero(date.getMonth()+1)}-${fillzero(date.getDate())}`
    const TIME = `${fillzero(date.getHours())}:${fillzero(date.getMinutes())}`
    return {DATE, TIME}
}

function fetchMessage() {
    return [
        {
            me: true,
            type: "text",
            content: "你好",
            date: "2021-02-02",
            time: "17:05"
        },
        {
            me: false,
            type: "text",
            content: "hello",
            date: "2022-02-02",
            time: "17:06"
        },
        {
            me: false,
            type: "text",
            content: "hello",
            date: "2022-02-02",
            time: "17:07"
        }
    ]
}

/* React Components */
const onMOBILE = (/Mobi|Android|iPhone/i.test(navigator.userAgent))
export default function ChatRoom() {
    const [fullscreen, setFullscreen] = useState("")
    const [messages, setMessages] = useState([])
    const textareaRef = useRef()
    useEffect( () => {
        document.title = "小杏 - 聊天室"
        setMessages(fetchMessage())
    }, [])
    useEffect( () => {
        window.scrollTo("top", document.body.clientHeight)
    }, [messages])

    function detectKey(e) {
        const keyCode = e.which || e.keyCode
        if (onMOBILE) return
        if (keyCode === 13 && !e.shiftKey) {
            e.preventDefault()
            sendMessage()
        }
    }
    function sendMessage() {
        const content = textareaRef.current.value
        if (content.replaceAll('\n', '') === "") return
        const CURRENT = getCurrentTime()
        setMessages( prev => [...prev, {
            me: true,
            type: "text",
            content: content,
            date: CURRENT.DATE,
            time: CURRENT.TIME,
        }])
        textareaRef.current.value = ""
    }
    function onInputImgChange(e) {
        const length = e.target.files.length
        for (let i=0; i<length; i++) {
            const fileData = e.target.files[i]
            if (! isImageFormat(fileData)) continue
            // const url = URL.createObjectURL(fileData)
            // setInputImgs(prev => [...prev, url])
            const reader = new FileReader()
            reader.readAsDataURL(fileData)
            reader.addEventListener("load", () => {
                const base64Pic = reader.result
                const CURRENT = getCurrentTime()
                setMessages( prev => [...prev, {
                    me: true,
                    type: "img",
                    src: base64Pic,
                    date: CURRENT.DATE,
                    time: CURRENT.TIME,
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
                                ( parseInt(messages[i]?.date?.split("-")?.join("") || 0)  
                                - parseInt(messages[i-1]?.date?.split("-")?.join("") || 0) 
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
                onKeyDown={detectKey} ref={textareaRef} />
            <button className={style.button} onClick={sendMessage} >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-send-fill" viewBox="0 0 16 16">
                    <path d="M15.964.686a.5.5 0 0 0-.65-.65L.767 5.855H.766l-.452.18a.5.5 0 0 0-.082.887l.41.26.001.002 4.995 3.178 3.178 4.995.002.002.26.41a.5.5 0 0 0 .886-.083l6-15Zm-1.833 1.89L6.637 10.07l-.215-.338a.5.5 0 0 0-.154-.154l-.338-.215 7.494-7.494 1.178-.471-.47 1.178Z"/>
                </svg>
            </button>
        </div>
    </>
}