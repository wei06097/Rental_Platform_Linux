/* import */
/* ======================================== */
/* CSS */
import style from "./Bill.module.css"
/* API */
import API from "../../API"
/* Components */
import Back from "../../global/icon/Back"
import Card from "./Components/Card"
import MyDateTime from "./Components/MyDateTime"
import Position from "./Components/Position"
/* Hooks */
import { useState, useEffect, useRef } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
/* Redux */
import { useSelector } from "react-redux"
/* else */
import { v4 as uuidv4 } from "uuid"

/* ======================================== */
export default function Bill() {
    const {seller} = useParams()
    const navigate = useNavigate()
    const {token, account, isLogin} = useSelector(state => state.account)
    const [data, setData] = useState([]) // res 獲取購物車商品
    const [isLoading, setIsLoading] = useState(false)
    const [isHandling, setIsHandling] = useState(false)
    /* req body */
    //留言
    const commentRef = useRef()
    //商品數量及單項價格
    const [payload, setPayload] = useState({})
    //期望交貨時間、歸還時間
    const [myRentDates, setMyRentDates] = useState([{key:uuidv4(), datetime:""}]) 
    const [myReturnDates, setMyReturnDates] = useState([{key:uuidv4(), datetime:""}])
    //期望交貨地點
    const [positions, setPositions] = useState([{key:uuidv4(), position:""}])

    useEffect(() => {
        document.title = "填寫資料"
        if (!isLogin) navigate("/SignIn", {replace : true})
        if (seller === account) navigate(-1, {replace : true})
    }, [navigate, isLogin, seller, account])
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

    /* ======================================== */
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
    function addMyDates(setDates) {
        setDates(prev => [...prev, {key:uuidv4(), datetime:""}])
    }
    function deleteMyDates(setDates, index) {
        setDates(prev => {
            const newDates = [...prev]
            newDates.splice(index, 1)
            return newDates
        })
    }
    function addPositions() {
        setPositions(prev => [...prev, {key:uuidv4(), position:""}])
    }
    function deletePositions(index) {
        setPositions(prev => {
            const newPositions = [...prev]
            newPositions.splice(index, 1)
            return newPositions
        })
    }
    function submitHandler() {
        const blank1 = myRentDates.concat(myReturnDates)
            .filter(element => !element.datetime)
            .length !== 0
        const blank2 = positions
            .filter(content => !content.position)
            .length !== 0
        if (blank1 || blank2) {
            alert("請檢查是否填寫完成")
            return
        }
        const body = {
            options : {
                start : myRentDates.map(element => element.datetime),
                end : myReturnDates.map(element => element.datetime),
                position : positions.map(element => element.position)
            },
            comment : commentRef.current.value,
            order : payload
        }
        submitOrder(body)
    }
    async function submitOrder(body) {
        setIsHandling(true)
        const {success} = await API.post(API.NEW_ORDER, token, body)
        if (success) navigate("/MyShopping", {replace : true})
        else alert("請重新整理後再試一次")
        setIsHandling(false)
    }
    
    /* ==================== 分隔線 ==================== */
    return <>
        <header>
            <div className="flex_center">
                <Back />
                <span>填寫資料</span>
            </div>
            <div className="flex_center">
                <button className="button">
                    <Link className="link" to={`/Store/${seller}`}>前往賣場</Link>
                </button>
            </div>
            
        </header>
        <main className="main">
            {
                (isLoading || isHandling) &&
                <div className="loading-ring" />
            }
            {/* ======================================== */}
            <div className={style.products} style={{width:"100%", border:"0"}}>
                <div>
                    <div className={style.title}>
                        <span>期望交貨時間</span>
                        <button className={style.icon}
                            style={{visibility:(myRentDates.length < 4)? "visible":"hidden"}}
                            onClick={() => {addMyDates(setMyRentDates)}}
                            disabled={isLoading || isHandling}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="icon bi bi-plus-circle-fill" viewBox="0 0 16 16">
                                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3v-3z"/>
                            </svg>
                        </button>
                    </div>
                    {
                        myRentDates
                            .map((element, i) => <MyDateTime
                                key={element.key}
                                index={i}
                                length={myRentDates.length}
                                setDates={setMyRentDates}
                                deleteHandler={() => {deleteMyDates(setMyRentDates, i)}}
                                isLoading={isLoading || isHandling}
                            />)
                    }
                </div>
                <div>
                    <div className={style.title}>
                        <span>期望歸還時間</span>
                        <button className={style.icon}
                            style={{visibility:(myReturnDates.length < 4)? "visible":"hidden"}}
                            onClick={() => {addMyDates(setMyReturnDates)}}
                            disabled={isLoading || isHandling}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="icon bi bi-plus-circle-fill" viewBox="0 0 16 16">
                                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3v-3z"/>
                            </svg>
                        </button>
                    </div>
                    {
                        myReturnDates
                            .map((element, i) => <MyDateTime
                                key={element.key}
                                index={i}
                                length={myReturnDates.length}
                                setDates={setMyReturnDates}
                                deleteHandler={() => {deleteMyDates(setMyReturnDates, i)}}
                                isLoading={isLoading || isHandling}
                            />)
                    }
                </div>
            </div>
            {/* ======================================== */}
            <div className={style.title}>
                <span>期望交貨地點</span>
                <button className={style.icon}
                    style={{visibility:(positions.length < 4)? "visible":"hidden"}}
                    onClick={addPositions}
                    disabled={isLoading || isHandling}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="icon bi bi-plus-circle-fill" viewBox="0 0 16 16">
                        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3v-3z"/>
                    </svg>
                </button>
            </div>        
            {
                positions.map((element, i) => {
                    return <Position 
                        key={element.key}
                        index={i}
                        length={positions.length}
                        setDates={setPositions}
                        deleteHandler={() => {deletePositions(i)}}
                        isLoading={isLoading || isHandling}
                    />
                })
            }
            {/* ======================================== */}
            <div className={style.title}>留言</div>
            <textarea
                className={style.textarea} rows="6" wrap="soft" placeholder="非必填"
                disabled={isLoading || isHandling} ref={commentRef}
            />
            {/* ======================================== */}
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
            {/* ======================================== */}
            <textarea
                className={style.textarea} style={{border:"0", marginTop:"20px"}}
                rows="7" wrap="hard" disabled={true}
                placeholder={
                    `小提醒\n\n` +
                    `- 可以透過訊息與賣家討論交貨時間及地點\n` +
                    `- 建議先和賣家討論過後再下單\n` +
                    `- 金額會依據實際租借天數計算\n` +
                    `- 實際支付金額仍由賣家決定`
                }
            />
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
            <button
                className="button" onClick={submitHandler}
                disabled={isLoading || isHandling}
            >
                申請租借
            </button>
        </footer>
    </>
}
