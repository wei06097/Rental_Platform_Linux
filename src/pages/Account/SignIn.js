/* import */
/* ======================================== */
/* CSS */
import style from "./Account.module.css"
/* Functions */
import InputChecker from "../../global/functions/InputChecker"
import AccountActions from "../../global/functions/AccountActions"
/* Components */
import Back from "../../global/icon/Back"
/* React Hooks */
import { useRef, useLayoutEffect } from "react"
import { Link, useNavigate } from "react-router-dom"

/* ======================================== */
/* React Components */
export default function SignIn() {
    const navigate = useNavigate()
    const account_input = useRef()
    const password_input = useRef()
    useLayoutEffect( () => {
        document.title = "登入"
        checkLogin()
        async function checkLogin() {
            const logined = await AccountActions.check()
            if (logined) navigate("/")
        }
    }, [navigate])
    function doLogin(e) {
        e.preventDefault()
        const account = account_input.current.value
        const password = password_input.current.value
        const legal = InputChecker.noBlank(account, password)
        if (legal) AccountActions.login( {account, password}, () => {navigate("/")} )
    }

    return <>
        <header>
            <div className="flex_center">
                <Back />
                <span>登入</span>
            </div>
        </header>
        <main className="main">
            <form className={style.container} onSubmit={doLogin}>
                <div style={{fontSize:"25px", textAlign:"center"}}>登入</div>
                <br />

                <p>帳號</p>
                <input type="text" ref={account_input} />
                <p>密碼</p>
                <input type="password" autoComplete="true" ref={password_input} />
                
                <br />
                <input type="submit" value="確認" />
                <br /><br />
                <div style={{fontSize:"15px", textAlign:"center"}}>
                    <span style={{paddingRight: "5px"}}>沒有帳號?</span>
                    <Link to="/SignUp">註冊</Link>
                </div>
            </form>
        </main>
    </>
}