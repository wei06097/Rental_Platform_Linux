/* CSS */
import style from "./Profile.module.css"

/* header 的按鈕 */
import Back from "../../global/icon/Back"

/* React Hooks */
import { useEffect } from "react"

/* Functions */

/* React Components */
export default function Profile() {
    useEffect( () => {
        document.title = "個人檔案"
    }, [])
    return <>
        <header>
            <div className="flex_center">
                <Back />
                <span>個人檔案</span>
            </div>
            <div className="flex_center">
                <button className="icon-button">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="icon bi bi-check-lg" viewBox="0 0 16 16">
                        <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425a.247.247 0 0 1 .02-.022Z"/>
                    </svg>
                </button>
            </div>
        </header>
        <main className="main">
            <div className={style.container}>
                <div>
                    <div>帳號</div>
                    <div>kokoro12345</div>
                </div>
                <div>
                    <div>名稱</div>
                    <input type="text" />
                </div>
                <div>
                    <div>賣場簡介</div>
                    <textarea rows="10" wrap="soft"></textarea>
                </div>
                <div>
                    <div>手機</div>
                    <input type="number" />
                </div>
                <div>
                    <div>信箱</div>
                    <input type="text" />
                </div>
                <button className="button">更改密碼</button>
            </div>
        </main>
    </>
}