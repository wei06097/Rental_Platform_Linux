/* import */
/* ======================================== */
/* CSS */
import style from "./ShoppingCart.module.css"
/* API */
import API from "../../API"
/* Components */
import Back from "../../global/icon/Back"
import Message from "../../global/icon/Message"
import Home from "../../global/icon/Home"
import Card from "./components/Card"
/* Hooks */
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
/* Redux */
import { useSelector } from "react-redux"

/* ======================================== */
export default function ShoppingCart() {
    const navigate = useNavigate()
    const {token, isLogin} = useSelector(state => state.account)
    const [data, setData] = useState({})
    const [isLoading, setIsLoading] = useState(false)

    useEffect( () => {
        document.title = "購物車"
        if (!isLogin) navigate("/SignIn", {replace : true})
    }, [navigate, isLogin])
    useEffect(() => {
        init()
        async function init() {
            setIsLoading(true)
            const {success, result} = await API.get(API.MY_CART, token)
            if (success) setData(result)
            setIsLoading(false)
        }
    }, [token])

    /* ==================== 分隔線 ==================== */
    return <>
        <header>
            <div className="flex_center">
                <Back />
                <span>購物車</span>
            </div>
            <div className="flex_center">
                <Message />
                <Home />
            </div>
        </header>
        {
            isLoading?
            <div className="loading-ring" />:
            (Object.keys(data).length !== 0)?
            <main className={`main ${style.main}`} >
                {
                    Object.keys(data)
                        .map(account => {
                            return (
                                <Card 
                                    key={account}
                                    account={account}
                                    data={data[account]} 
                                />
                            )
                        })
                }
            </main>:
            <div style={{textAlign: "center", marginTop: "20px"}}>清單是空的</div>
        }
    </>
}
