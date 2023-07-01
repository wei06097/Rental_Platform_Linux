/* import */
/* ======================================== */
/* CSS */
import style from "./Bill.module.css"
/* API */
import API from "../../API"
/* Components */
import Back from "../../global/icon/Back"
import Card from "./Components/Card"
/* Hooks */
import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
/* Redux */
import { useSelector } from "react-redux"

/* ======================================== */
export default function Bill() {
    const {seller} = useParams()
    const navigate = useNavigate()
    const {token, isLogin} = useSelector(state => state.account)
    const [data, setData] = useState([])
    const [payload, setPayload] = useState({})
    const [isLoading, setIsLoading] = useState(false)
    const [isHandling, setIsHandling] = useState(false)

    useEffect(() => {
        document.title = "結帳"
        if (!isLogin) navigate("/SignIn", {replace : true})
    }, [navigate, isLogin])
    useEffect(() => {
        init()
        async function init() {
            setIsLoading(true)
            const {success, result} = await API.get(`${API.MY_STORECART}?seller=${seller}`, token)
            if (success) setData(result)
            if (!result[0]) navigate(-1, {replace : true})
            setIsLoading(false)
        }
    }, [navigate, seller, token])

    async function deleteProduct(id) {
        if (isHandling) return
        setIsHandling(true)
        const {success} = await API.del(`${API.CRUD_CART}/?id=${id}`, token)
        if (success) {
            const newData = data.filter(element => element.id !== id)
            const newPayload = {...payload}
            delete newPayload[id]
            if (!newData[0]) {
                navigate(-1, {replace : true})
                return
            }
            setData(newData) 
            setPayload(newPayload)
        }
        setIsHandling(false)
    }
    
    /* ==================== 分隔線 ==================== */
    return <>
        <header>
            <div className="flex_center">
                <Back />
                <span>結帳</span>
            </div>
        </header>
        <main className="main">
            {
                (isHandling || isLoading) &&
                <div className="loading-ring" />
            }
            
            <div className={style.title}>預計借用日期</div>
            <div className={style.data}>
                <input type="date" disabled={isLoading} />
                <input type="time" disabled={isLoading} />
            </div>
            <div className={style.title}>預計歸還日期</div>
            <div className={style.data}>
                <input type="date" disabled={isLoading} />
                <input type="time" disabled={isLoading} />
            </div>
            <div className={style.title}>留言</div>
            <textarea
                className={style.textarea}
                rows="10" wrap="soft"
                disabled={isLoading}
            />
            {
                !isLoading &&
                <>
                    <div className={style.title}>選擇數量</div>
                    <div className={style.products}>
                        {
                            data
                                .map((element, i) => {
                                    return (
                                        <Card
                                            key={element.id}
                                            element={element}
                                            noBorder={((i===data.length-1) || ((i===data.length-2)&&(data.length%2===0)))}
                                            payload={payload}
                                            setPayload={setPayload}
                                            deleteProduct={deleteProduct}
                                            isHandling={isHandling}
                                        />
                                    )
                                })
                        }
                    </div>
                </>
            }
        </main>
        <div className="base"></div>
        <footer className={style.footer}>
            <div>
                <span>總金額 </span>
                <span>
                    NT$
                    {
                        Object
                            .keys(payload)
                            .map(id => Number(payload[id].amount) * Number(payload[id].price))
                            .reduce((accumulator, currentValue) => accumulator + currentValue, 0)
                    }
                </span>
                <span> / 天</span>
            </div>
            <button className="button">確定</button>
        </footer>
    </>
}