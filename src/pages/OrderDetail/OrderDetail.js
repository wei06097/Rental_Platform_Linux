/* import */
/* ======================================== */
/* API */
import API from "../../API"
/* CSS */
import "../../global/css/switch.css"
import style from "./OrderDetail.module.css"
/* Components */
import Back from "../../global/icon/Back"
import Card from "./components/Card"
import OptionsArea from "./components/OptionsArea"
import SelectedOptionArea from "./components/SelectedOptionArea"
import ActualArea from "./components/ActualArea"
/* Hooks */
import { useState, useEffect, useMemo } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
/* Redux */
import { useSelector, useDispatch } from "react-redux"
import { setOrderPage } from "../../slice/globalSlice"
/* Else */
const messages = ["訂單待確認", "商品待交貨", "商品待歸還", "訂單已完成", "訂單不成立"]
const texts = ["", "是否要確認訂單", "是否要取消訂單", "是否已經收到商品", "是否已經收到歸還的商品"]

/* ======================================== */
export default function OrderDetail() {
    const {id} = useParams()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const {token, account, isLogin} = useSelector(state => state.account)
    const [result, setResult] = useState({})
    const [decision, setDecision] = useState({start:"", end:"", position:""})
    const [showingOpts, setShowingOpts] = useState(true)
    const [isLoading, setIsLoading] = useState(true)
    const [isHandling, setIsHandling] = useState(false)

    /* 使用回傳資料result 處理其他要顯示的資料 */
    const {provider, consumer, progress, order, totalprice, comment, options, usingMessage, selectedOption, actual} = result
    const isProvider = (account === provider?.account)
    const userAccount = isProvider? consumer?.account: provider?.account
    const message = messages[Number(progress)===-1? 4: Number(progress)]
    /* 計算借用天數跟金額 */
    const BorrowdDays = useMemo(() => {
        if (!actual || !(progress === 2 || progress === 3)) return 0
        const difference = (progress === 3)
            ? new Date(actual.end) - new Date(actual.start)
            : new Date(Date.now()) - new Date(actual.start)
        const days = difference / (24 * 3600 * 1000)
        return days.toFixed(4)
    }, [progress, actual])
    const SuggestedPrice = useMemo(() => {
        const total = BorrowdDays * totalprice
        return total.toFixed(0)
    }, [BorrowdDays, totalprice])

    useEffect(() => {
        document.title = "訂單詳情"
        if (!isLogin) navigate("/SignIn", {replace : true})
    }, [navigate, isLogin])
    useEffect(() => {
        init()
        async function init() {
            const {success, order} = await API.get(`${API.ORDER}?id=${id}`, token)
            if (success) setResult(order)
            setIsLoading(false)
        }
    }, [token, id])

    /* ======================================== */
    async function submitHandler(mode) {
        //mode為操作模式 1確認 2取消 3已收貨 4已歸還
        const blank1 = Object.keys(decision)
            .filter(key => !decision[key])
            .length !== 0
        if (mode === 1 && showingOpts && blank1) {
            alert("請檢查選項皆已勾選")
            return
        }
        const isConfirm = window.confirm(texts[mode])
        if (!isConfirm) return
        setIsHandling(true)
        const payload = (mode === 1)? {usingMessage:!showingOpts, selectedOption:decision}: {}
        const {success} = await API.put(`${API.ORDER}?id=${id}&mode=${mode}`, token, payload)
        if (success) {
            dispatch(setOrderPage(returnNextOrderState(mode)))
            navigate(`/MyOrder/${isProvider? "provider": "consumer"}`, {replace : true})
        }
        setIsHandling(false)
    }
    function returnNextOrderState(mode) {
        switch (mode) {
            case 1:
                return 1
            case 2:
                return -1
            case 3:
                return 2
            case 4:
                return 3
            default:
                return 0
        }
    }
    
    /* ==================== 分隔線 ==================== */
    return <>
        <header>
            <div className="flex_center">
                <Back />
                <span>訂單詳情</span>
            </div>
            {
                !isLoading &&
                <div className="flex_center">
                    <Link to={`/ChatRoom/${userAccount}`}>
                        <button className="icon-button">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="icon bi bi-chat-fill" viewBox="0 0 16 16">
                                <path d="M8 15c4.418 0 8-3.134 8-7s-3.582-7-8-7-8 3.134-8 7c0 1.76.743 3.37 1.97 4.6-.097 1.016-.417 2.13-.771 2.966-.079.186.074.394.273.362 2.256-.37 3.597-.938 4.18-1.234A9.06 9.06 0 0 0 8 15z"/>
                            </svg>
                        </button>
                    </Link>
                </div>
            }
        </header>
        {
            (isLoading || isHandling) &&
            <div className="loading-ring" />
        }
        {
            !isLoading &&
            <main className="main">
                <div className={style.state}>{message}</div>
                {/* ======================================== */}
                { //控制是否只透過私訊
                    progress === 0 && isProvider &&
                    <div className={style.switch}>
                        <div className={style.title}>通過訊息 決定時間和地點</div>
                        <label className="toggle-control">
                            <input type="checkbox" defaultChecked={false}
                                disabled={isHandling}
                                onChange={(e) => {
                                    setShowingOpts(!e.target.checked)
                                    setDecision({start:"", end:"", position:""})
                                }}
                            />
                            <span className="control" />
                        </label>
                    </div>
                }
                { //顯示時間地點選項
                    progress === 0 && showingOpts &&
                    <OptionsArea
                        isProvider={isProvider}
                        options={options}
                        setDecision={setDecision}
                        isHandling={isHandling}
                    />
                }
                {/* ======================================== */}
                { //顯示實際時間
                    (progress === 2 || progress === 3) && actual &&
                    <ActualArea
                        start={actual.start}
                        end={actual.end}
                    />
                }
                { //顯示賣家選擇的時間地點
                    (progress === 1 || progress === 2) && usingMessage?
                    <div className={style.textarea} style={{textAlign:"center"}}>
                        請通過訊息與{isProvider? "買家": "賣家"}討論{progress===1? "交貨": "歸還"}時間和地點
                    </div>:
                    (progress === 1 || progress === 2) && selectedOption &&
                    <SelectedOptionArea
                        option={selectedOption}
                    />
                }
                {/* ======================================== */}
                <div className={style.title}>租借商品</div>
                <div className={style.products} style={{marginBottom:"0"}}>
                    {
                        order && order
                            .map((element, i) => {
                                return (
                                    <Card
                                        key={element.id}
                                        element={element}
                                        noBorder={((i===order.length-1) || ((i===order.length-2)&&(order.length%2===0)))}
                                    />
                                )
                            })
                    }
                </div>
                <div className={style.totalprice}>
                    <div>
                        <span>單日金額</span>
                        <span>NT${totalprice}</span>
                    </div>
                    {
                        (progress === 2 || progress === 3) && actual &&
                        <>
                            <div>
                                <span>{progress === 2? "累積天數": "借用天數"}</span>
                                <span>×{BorrowdDays}</span>
                            </div>
                            <div>
                                <span>{progress === 2? "累積金額": "建議金額"}</span>
                                <span>NT${SuggestedPrice}</span>
                            </div>
                        </>
                    }
                </div>
                {/* ======================================== */}
                {
                    comment &&
                    <>
                        <div className={style.title}>買家留言</div>
                        <div className={style.textarea}>{comment}</div>
                    </>
                }
                <div className={style.title}>聯絡方式</div>
                <div className={style.products} style={{gap:"5px", border:"0"}}>
                    <div className={style.info}>
                        <div>
                            <span>買家</span>
                            <span>{consumer?.nickname || ""}</span>
                        </div>
                        <div>
                            <span>電話</span>
                            <span>{consumer?.phone || ""}</span>
                        </div>
                        <div>
                            <span>信箱</span>
                            <span>{consumer?.mail || ""}</span>
                        </div>
                    </div>
                    <div className={style.info}>
                        <div>
                            <span>賣家</span>
                            <span>{provider?.nickname || ""}</span>
                        </div>
                        <div>
                            <span>電話</span>
                            <span>{provider?.phone || ""}</span>
                        </div>
                        <div>
                            <span>信箱</span>
                            <span>{provider?.mail || ""}</span>
                        </div>
                    </div>
                </div>
                {/* ======================================== */}
            </main>
        }
        {
            !isLoading && (progress === 0 || progress === 1) &&
            <>
                <div className="base" />
                <footer>
                    {
                        (progress === 0 || progress === 1) &&
                        <button className="button grow" disabled={isHandling}
                            onClick={() => {submitHandler(2)}}>取消訂單</button>
                    }
                    {
                        progress === 0 && isProvider &&
                        <button className="button grow" disabled={isHandling}
                            onClick={() => {submitHandler(1)}}>確認訂單</button>
                    }
                    {
                        progress === 1 && !isProvider &&
                        <button className="button grow" disabled={isHandling}
                            onClick={() => {submitHandler(3)}}>已收貨</button>
                    }
                </footer>
            </>
        }
        {
            !isLoading && progress === 2 && isProvider &&
            <>
                <div className="base" />
                <footer>
                    <button className="button grow" disabled={isHandling}
                        onClick={() => {submitHandler(4)}}>已歸還</button>
                </footer>
            </>
        }
    </>
}

/*
    progress = 0
        買家: 取消訂單
        賣家: 取消訂單 確認訂單
    progress = 1
        買家: 取消訂單 已收貨
        賣家: 取消訂單
    progress = 2
        買家: 
        賣家: 已歸還
    progress = 3, -1
        只能看沒有按鈕
*/
