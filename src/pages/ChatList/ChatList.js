/* CSS */
import style from "./ChatList.module.css"

/* Components */

/* header 的按鈕 */
import Back from "../../global/icon/Back"

/* React Hooks */
import { useEffect } from "react"
import { Link } from "react-router-dom"

/* Functions */

/* React Components */
export default function ChatList() {
    useEffect( () => {
        document.title = "聊天室"
    }, [])
    return <>
        <header>
            <div className="flex_center">
                <Back />
                <span>聊天室</span>
            </div>
        </header>
        <main className="main">
            <div className={style.container}>
                <Link className={style.card} to="ChatRoom">
                    <div className={style.img}></div>
                    <div className={style.content}>
                        <div>Name</div>
                        <div>message</div>
                    </div>
                </Link>
                <Link className={style.card} to="ChatRoom">
                    <div className={style.img}></div>
                    <div className={style.content}>
                        <div>Name</div>
                        <div>messagemessagemessagemessagemessagemessagemessagemessagemessage messagemessagemessagemessage messagemessagemessagemessagemessage sfdsfsdf sfdsfsdf</div>
                    </div>
                </Link>
            </div>
        </main>
    </>
}