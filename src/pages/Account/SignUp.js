/* CSS */
import style from "./Account.module.css"

/* Components */
import Back from "../../global/icon/Back"

/* React Hooks */
import { useEffect } from "react"
import { Link } from "react-router-dom"

/* React Components */
export default function SignUp() {
    useEffect( () => {
        document.title = "註冊"
    }, [])
    return <>
        <header>
            <div className="flex_center">
                <Back />
                <span>註冊</span>
            </div>
        </header>
        <main className="main">
            <form action="" method="post" className={style.container}>
                <div style={{fontSize:"25px", textAlign:"center"}}>
                    註冊
                </div>
                <br />

                <p>帳號</p>
                <input type="text" autoComplete="username" />
                <p>密碼</p>
                <input type="password" autoComplete="new-password"/>
                <p>確認密碼</p>
                <input type="password" autoComplete="new-password"/>
                <p>手機</p>
                <input type="number" />
                <p>信箱</p>
                <input type="text" />
                <br />

                <input type="submit" value="確認" />
                <br />
                <br />

                <div style={{fontSize:"15px", textAlign:"center"}}>
                    <span style={{paddingRight: "5px"}}>已經有帳號?</span>
                    <Link to="/SignIn">登入</Link>
                </div>
            </form>
        </main>
    </>
}