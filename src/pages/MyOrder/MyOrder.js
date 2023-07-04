/* import */
/* ======================================== */
/* CSS */
import style from "./MyOrder.module.css"
/* API */
import API from "../../API"
/* Components */
import Back from "../../global/icon/Back"
import Home from "../../global/icon/Home"
import Reload from "../../global/icon/Reload"
import GotoTop from "../../global/icon/GotoTop"
import Card, { LoadingCard } from "./components/Card"
/* Hooks */
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
/* Redux */
import { useSelector } from "react-redux"

/* ======================================== */
async function getRemoteOrders(progress, token, setOrders, setIsLoading) {
    setIsLoading(true)
    const {success, orders} = await API.get(`${API.OVERVIEW_ORDER}/?progress=${progress}&status=provider`, token)
    if (success) setOrders(orders || [])
    setIsLoading(false)
}

export default function MyOrder() {
    const navigate = useNavigate()
    const {token, isLogin} = useSelector(state => state.account)
    const [state, setState] = useState(0)
    const [orders, setOrders] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        document.title = "我的訂單"
        if (!isLogin) navigate("/SignIn", {replace : true})
    }, [navigate, isLogin])
    useEffect(() => {
        getRemoteOrders(0, token, setOrders, setIsLoading)
    }, [token])

    function changeState(e) {
        const progress = Number(e.target.id)
        if (progress === state) return
        setState(progress)
        getRemoteOrders(progress, token, setOrders, setIsLoading)
    }
    
    /* ==================== 分隔線 ==================== */
    return <>
        <header className="header2">
            <div>
                <div className="flex_center">
                    <Back />
                    <span>我的訂單</span>
                </div>
                <div className="flex_center">
                    <Home />
                </div>
            </div>
            <div>
                <div id="0" onClick={changeState} className={state===0? "selected": ""}>待確認</div>
                <div id="1" onClick={changeState} className={state===1? "selected": ""}>待交貨</div>
                <div id="2" onClick={changeState} className={state===2? "selected": ""}>待歸還</div>
                <div id="3" onClick={changeState} className={state===3? "selected": ""}>已完成</div>
                <div id="-1" onClick={changeState} className={state===-1? "selected": ""}>不成立</div>
            </div>
        </header>
        <main className={`main ${style.main}`} >
            <Reload reloadHandler={
                () => {getRemoteOrders(state, token, setOrders, setIsLoading)}}
            />
            <GotoTop/>
            {
                isLoading?
                <>
                    <LoadingCard />
                    <LoadingCard />
                    <LoadingCard />
                    <LoadingCard />
                </>:
                orders
                    .map(element => {
                        return <Card 
                            key={element.order_id}
                            element={element}
                        />
                    })
            }
        </main>
        {
            !isLoading && (orders.length === 0) &&
            <div style={{textAlign: "center"}}>沒有訂單</div>
        }
    </>
}
