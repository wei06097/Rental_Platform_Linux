/* import */
/* ======================================== */
/* CSS */
import style from "./Store.module.css"
/* API */
import API from "../../API"
/* Components */
import Back from "../../global/icon/Back"
import Home from "../../global/icon/Home"
import Reload from "../../global/icon/Reload"
import GotoTop from "../../global/icon/GotoTop"
import OverviewCards from "../../global/components/OverviewCards"
/* Hooks */
import { useEffect } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
/* Redux */
import { useSelector, useDispatch } from "react-redux"
import { getStoreInfo } from "../../slice/storeSlice"
import { resetExistState } from "../../slice/storeSlice"

/* ======================================== */
/* React Components */
export default function Store() {
    const {seller} = useParams()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const {account} = useSelector(state => state.account)
    const {store, isExist, isLoading} = useSelector(state => state.store)

    const PATHNAME = window.location.pathname
    const haveData = Object.keys(store).includes(PATHNAME)
    const {provider, products} = haveData? store[PATHNAME]: {provider:{}, products:[]}
    const {nickname, intro, phone, mail} = provider
    const title = (seller === account)? "我的賣場": nickname? `${nickname}的賣場`: "賣場"

    useEffect(() => {
        document.title = title
    }, [title])
    useEffect(() => {
        if (!haveData) dispatch(getStoreInfo({seller}))
    }, [dispatch, seller, haveData])
    useEffect(() => {
        if (!isExist) {
            dispatch(resetExistState())
            navigate("/NotFound", {replace : true})
        }
    }, [navigate, dispatch, isExist])

    function reloadHandler() {
        dispatch(getStoreInfo({seller}))
    }
    
    /* ==================== 分隔線 ==================== */
    return <>
        <header>
            <div className="flex_center">
                <Back />
                <span>{title}</span>
            </div>
            <div className="flex_center">
                <Home />
            </div>
        </header>
        <main className="main">
            <GotoTop />
            <Reload reloadHandler={reloadHandler} />
            <div className={style.info}>
                <p>簡介</p>
                {
                    isLoading?
                    <div className="fill skeleton" style={{height:"30px", maxWidth:"500px"}} />:
                    <div>{isExist && intro}</div>
                }
                <p>聯絡方式</p>
                {
                    isLoading?
                    <div className="fill skeleton" style={{height:"30px", maxWidth:"500px"}} />:
                    <>
                        <div>{isExist && `手機: ${phone}`}</div>
                        <div>{isExist && `信箱: ${mail}`}</div>
                    </>
                }
            </div>
            {
                isLoading?
                <div className="loading-ring" />:
                !(products[0])?
                <div style={{textAlign: "center"}}>沒有商品</div>:
                <OverviewCards>
                    {
                        products
                            .map( element => 
                                <OverviewCards.ProductCard
                                    key={element?.id}
                                    id={element?.id}
                                    link={`${API.WS_URL}/${element?.imgs[0] || "img/0"}`}
                                    name={element?.name}
                                    price={element?.price}
                                    showHeart={false}
                                />
                            )
                    }
                </OverviewCards>
            }
        </main>
        <div className="base" />
        <footer>
            {
                (seller === account)?
                <>
                    <Link className="link flex_center grow" to="/MyOrder">
                        <button className="button grow">我的訂單</button>
                    </Link>
                    <Link className="link flex_center grow" to="/MyProducts">
                        <button className="button grow">我的商品</button>
                    </Link>
                </>:
                <>
                    <Link className="link flex_center grow" to={`/ChatRoom/${seller}`}>
                        <button className="button grow" disabled={isLoading}>聊天</button>
                    </Link>
                </>
            }
        </footer>
    </>
}
