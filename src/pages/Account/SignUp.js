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
import { doSignup, clcHandler } from "../../slice/accountSlice"

/* ======================================== */
/* React Components */
export default function SignUp() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const {isLogin, isHandling, isOldInputs} = useSelector(state => state.account)
    const accountRef = useRef()
    const passwordRef = useRef()
    const password2Ref = useRef()
    const phoneRef = useRef()
    const mailRef = useRef()

    useEffect( () => {
        document.title = "註冊"
    }, [])
    useEffect( () => {
        if (isLogin) navigate("/")
    }, [navigate, isLogin])
    useEffect(() => {
        if (isOldInputs) {
            accountRef.current.value = ""
            passwordRef.current.value = ""
            password2Ref.current.value = ""
            phoneRef.current.value = ""
            mailRef.current.value = ""
            dispatch(clcHandler())
        }
    }, [dispatch, isOldInputs])

    function submitHandler(e) {
        e.preventDefault()
        const account = accountRef.current.value
        const password = passwordRef.current.value
        const password2 = password2Ref.current.value
        const phone = phoneRef.current.value
        const mail = mailRef.current.value
        const isSame = password === password2
        const isLegal = InputChecker.noBlank(account, password, phone, mail)
        if (!isSame) alert("輸入密碼不相同")
        else if (!isLegal) alert("輸入不可為空白")
        else dispatch(doSignup({account, password, phone, mail}))
    }
    function signinHandler(e) {
        if (isHandling) e.preventDefault()
    }

    /* ==================== 分隔線 ==================== */
    return <>
        <header>
            <div className="flex_center">
                <Back />
                <span>註冊</span>
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
                <div style={{fontSize:"25px", textAlign:"center"}}>註冊</div>
                <br />

                <p>帳號</p>
                <input type="text" autoComplete="username" ref={accountRef} />
                <p>密碼</p>
                <input type="password" autoComplete="new-password" ref={passwordRef} />
                <p>確認密碼</p>
                <input type="password" autoComplete="new-password" ref={password2Ref} />
                <p>手機</p>
                <input type="number" ref={phoneRef} />
                <p>信箱</p>
                <input type="text" ref={mailRef} />
                <br />
                <input type="submit" value="確認"/>
                <br /><br />

                <div style={{fontSize:"15px", textAlign:"center"}}>
                    <span style={{paddingRight: "5px"}}>已經有帳號?</span>
                    <Link to="/SignIn" onClick={signinHandler}>登入</Link>
                </div>
            </form>
        </main>
    </>
}
