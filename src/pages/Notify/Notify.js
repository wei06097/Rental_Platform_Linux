/* import */
/* ======================================== */
/* CSS */
import style from "./Notify.module.css"
/* API */
import API from "../../API"
/* Components */
import Back from "../../global/icon/Back"
/* Hooks */
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
/* Redux */
import { useSelector } from "react-redux"

/* ======================================== */
export default function Notify() {
    const navigate = useNavigate()
    const { token, isLogin } = useSelector(state => state.account)
    const [list1, setList1] = useState([])
    const [list2, setList2] = useState([])
    const [mode, setMode] = useState("consumer")
    const [isLoading, setIsLoading] = useState(true)
    
    useEffect(() => {
        if (!isLogin) navigate("/SignIn", {replace : true})
        else init()
        async function init() {
            const {consumer_orderlist, provider_orderlist} = await API.get(API.ORDER_NOTIFY, token)
            setList1(consumer_orderlist)
            setList2(provider_orderlist)
            setIsLoading(false)
        }
    }, [navigate, isLogin, token])
    
    async function markHandler(order_id) {
        await API.put(`${API.ORDER_NOTIFY}?id=${order_id}`, token)
        navigate(`/OrderDetail/${order_id}`)
    }
    async function markAll() {
        await API.put(`${API.ORDER_NOTIFY}?all=true`, token)
        setList1(prev => {
            return prev.map(element => {return {...element, read:true}})
        })
        setList2(prev => {
            return prev.map(element => {return {...element, read:true}})
        })
    }

    /* ==================== 分隔線 ==================== */
    return <>
        <header className="header2">
            <div>
                <div className="flex_center">
                    <Back />
                    <span>訂單更新通知</span>
                </div>
                <button className="icon-button" style={{width:"max-content"}}
                    onClick={markAll}>全部已讀</button>
            </div>
            <div>
                <div onClick={() => {setMode("consumer")}}
                    className={`grow ${mode === "consumer"? "selected": ""}`}>我的通知</div>
                <div onClick={() => {setMode("provider")}}
                    className={`grow ${mode === "provider"? "selected": ""}`}>賣場通知</div>
            </div>
        </header>
        <main className="main">
            {
                isLoading && 
                <div className="loading-ring" />
            }
            {
                mode === "consumer"?
                list1.slice().reverse()
                    .map(element => {
                        return <Card 
                            key={element.order_id}
                            element={element}
                            onClick={() => {markHandler(element.order_id)}}
                        />
                    }):
                list2.slice().reverse()
                    .map(element => {
                        return <Card 
                            key={element.order_id}
                            element={element}
                            onClick={() => {markHandler(element.order_id)}}
                        />
                    })
            }
        </main>
    </>
}

function Card({ element, onClick }) {
    const string = element.progress === 0?
        "訂單待確認": element.progress === 1?
        "商品待交貨": element.progress === 2?
        "商品待歸還": element.progress === 3?
        "訂單已完成": "訂單已取消"
    return <>
        <div className={`${style.card} ${!element.read && style.unread}`} onClick={onClick}>
            <div className={style.img}>
                <img src={`${API.WS_URL}/${element.cover}`} alt="" />
            </div>
            <div>{`<${string}> 訂單編號 : ${element.order_id}`}</div>
        </div>
    </>
}
