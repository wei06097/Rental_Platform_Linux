/* import */
/* ======================================== */
/* CSS */
import style from "./Account.module.css"
/* Functions */
import InputChecker from "../../global/functions/InputChecker"
/* Components */
import Back from "../../global/icon/Back"
import Home from "../../global/icon/Home"
/* Hooks */
import { useEffect, useRef } from "react"
import { Link, useNavigate } from "react-router-dom"
/* Redux */
import { useSelector, useDispatch } from "react-redux"
import { doLogin } from "../../slice/accountSlice"

/* ======================================== */
/* React Components */
export default function SignIn() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const {isLogin, isHandling} = useSelector(state => state.account)
    const accountRef = useRef()
    const passwordRef = useRef()
    
    useEffect(() => {
        document.title = "登入"
    }, [])
    useEffect(() => {
        if (isLogin) navigate("/")
    }, [isLogin, navigate])
    
    function submitHandler(e) {
        e.preventDefault()
        const account = accountRef.current.value
        const password = passwordRef.current.value
        const isLegal = InputChecker.noBlank(account, password)
        if (!isLegal) alert("輸入不合法")
        else dispatch(doLogin({account, password}))
    }
    function signupHandler(e) {
        if (isHandling) e.preventDefault()
    }
    
    /* ==================== 分隔線 ==================== */
    return <>
        <header>
            <div className="flex_center">
                <Back />
                <span>登入</span>
            </div>
            <div className="flex_center">
                <Home />
            </div>
        </header>
        <main className="main">
            {
                isHandling &&
                <div className="loading-ring" />
            }
            <form className={style.container} onSubmit={submitHandler}>
                <div style={{fontSize:"25px", textAlign:"center"}}>登入</div>
                <br />

                <p>帳號</p>
                <input type="text" ref={accountRef} />
                <p>密碼</p>
                <input type="password" autoComplete="true" ref={passwordRef} />
                <br />
                <input type="submit" value="確認" disabled={isHandling} />
                <br /><br />

                <div style={{fontSize:"15px", textAlign:"center"}}>
                    <span style={{paddingRight: "5px"}}>沒有帳號?</span>
                    <Link to="/SignUp" onClick={signupHandler}>註冊</Link>
                </div>
            </form>
        </main>
    </>
}
