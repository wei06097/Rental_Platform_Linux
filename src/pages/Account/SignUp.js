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
import { useState, useLayoutEffect } from "react"
import { useNavigate, Link } from "react-router-dom"

/* ======================================== */
/* React Components */
export default function SignUp() {
    const navigate = useNavigate()
    const [account, setAccount] = useState("")
    const [password, setPassword] = useState("")
    const [password2, setPassword2] = useState("")
    const [phone, setPhone] = useState("")
    const [mail, setMail] = useState("")
    useLayoutEffect( () => {
        document.title = "註冊"
        checkLogin()
        async function checkLogin() {
            const logined = await AccountActions.check()
            if (logined) navigate("/")
        }
    }, [navigate])

    function doSignup(e) {
        e.preventDefault()
        const legal = InputChecker.noBlank(account, password, phone, mail) && (password === password2)
        if (legal) AccountActions.signup( {account, password, phone, mail}, () => {navigate("/SignIn")} )
    }
    function comparePassword(e) {
        setPassword2(e.target.value)
        const correct = (password === e.target.value) && (e.target.value !== "")
        if (correct) e.target.classList.add(style.shadow)
        else e.target.classList.remove(style.shadow)
    }
    function addShadow(e) {
        if (e.target.value === "") e.target.classList.remove(style.shadow)
        else e.target.classList.add(style.shadow)
    }
    
    return <>
        <header>
            <div className="flex_center">
                <Back />
                <span>註冊</span>
            </div>
        </header>
        <main className="main">
            <form className={style.container} onSubmit={doSignup}>
                <div style={{fontSize:"25px", textAlign:"center"}}>註冊</div>
                <br />

                <p>帳號</p>
                <input type="text" autoComplete="username"
                    value={account} onChange={e => {
                        setAccount(e.target.value)
                        addShadow(e)
                    }}
                />
                <p>密碼</p>
                <input type="password" autoComplete="new-password"
                    value={password} onChange={e => {
                        setPassword(e.target.value)
                        addShadow(e)
                    }}
                />
                <p>確認密碼</p>
                <input type="password" autoComplete="new-password"
                    value={password2} onChange={comparePassword}
                />
                <p>手機</p>
                <input type="number"
                    value={phone} onChange={e => {
                        setPhone(e.target.value)
                        addShadow(e)
                    }}
                />
                <p>信箱</p>
                <input type="text"
                    value={mail} onChange={e => {
                        setMail(e.target.value)
                        addShadow(e)
                    }}
                />
                
                <br />
                <input type="submit" value="確認" />
                <br /><br />
                <div style={{fontSize:"15px", textAlign:"center"}}>
                    <span style={{paddingRight: "5px"}}>已經有帳號?</span>
                    <Link to="/SignIn">登入</Link>
                </div>
            </form>
        </main>
    </>
}