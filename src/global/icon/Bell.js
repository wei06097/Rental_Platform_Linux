/* import */
/* ======================================== */
import API from "../../API"
/* Hooks */
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

/* ======================================== */
export default function Bell() {
    const navigate = useNavigate()
    const {token} = useSelector(state => state.account)
    const [number, setNumber] = useState(0)

    useEffect(() => {
        init()
        async function init() {
            const {consumer_orderlist, provider_orderlist} = await API.get(API.ORDER_NOTIFY, token)
            const number = (consumer_orderlist || []).concat(provider_orderlist || [])
                .filter(element => !element.read).length
            setNumber(number)
        }
    }, [token])
    
    /* ==================== 分隔線 ==================== */
    return <>
        <button
            number={number>99? 99: number}
            className={`icon-button ${number>0 && "number"}`} onClick={() => {navigate("/Notify")}}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="icon bi bi-bell-fill" viewBox="0 0 16 16">
                <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2zm.995-14.901a1 1 0 1 0-1.99 0A5.002 5.002 0 0 0 3 6c0 1.098-.5 6-2 7h14c-1.5-1-2-5.902-2-7 0-2.42-1.72-4.44-4.005-4.901z"/>
            </svg>
        </button>
    </>
}
