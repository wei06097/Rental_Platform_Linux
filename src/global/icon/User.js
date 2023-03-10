import style from "./User.module.css"

import { useState, useEffect, useRef } from "react"
import { Link } from "react-router-dom"

export default function User() {
    const selfRef = useRef(), dialog = useRef()
    const [visibility, setVisibility] = useState(false)
    useEffect( () => {
        function onPointerdown(e) {
            if (e.target.parentNode.parentNode === dialog.current) setVisibility(prev => prev)
            else if (e.target === selfRef.current) setVisibility(prev => !prev)
            else setVisibility(false)
        }
        window.addEventListener("pointerdown", onPointerdown)
        return () => {
            window.removeEventListener("pointerdown", onPointerdown)
        }
    }, [])
    return <>
        <button className={`${style.parent} icon-button`} ref={selfRef}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="icon bi bi-person-circle" viewBox="0 0 16 16">
                <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>
                <path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"/>
            </svg>
        </button>
        <div className={`${style.dialog} ${visibility? "": style.none}`} ref={dialog}>
            <Link to="/Profile">
                <button>個人檔案</button>
            </Link>
            <Link to="/MyStore">
                <button>我的賣場</button>
            </Link>
            <Link to="/MyCollect">
                <button>我的收藏</button>
            </Link>
            <Link to="/MyShopping">
                <button>購買清單</button>
            </Link>
            {/* <div /> */}
            <Link to="/SignIn">
                <button>登入</button>
            </Link>
            <Link to="/SignUp">
                <button>註冊</button>
            </Link>
        </div>
    </>
}