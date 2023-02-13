/* CSS */
import style from "./Account.module.css"

/* Components */
import Back from "../../global/icon/Back"

/* React Hooks */
import { useEffect } from "react"
import { Link } from "react-router-dom"

/* React Components */
export default function SignIn() {
    useEffect( () => {
        document.title = "登入"
    }, [])
    return <>
        <header>
            <div className="flex_center">
                <Back />
                <span>登入</span>
            </div>
        </header>
        <main className="main">
            <form action="" method="post" className={style.container}>
                <div style={{fontSize:"25px", textAlign:"center"}}>
                    登入
                </div>
                <br />

                <p>帳號</p>
                <input type="text"/>
                <p>密碼</p>
                <input type="password" autoComplete="true" />
                <br />

                <input type="submit" value="確認" />
                <br />
                <br />

                <div style={{fontSize:"15px", textAlign:"center"}}>
                    <span style={{paddingRight: "5px"}}>沒有帳號?</span>
                    <Link to="/SignUp">註冊</Link>
                </div>
            </form>
        </main>
    </>
}