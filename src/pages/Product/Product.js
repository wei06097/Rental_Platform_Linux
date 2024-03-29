/* import */
/* ======================================== */
/* CSS */
import style from "./Product.module.css"
/* API */
import API from "../../API"
/* Components */
import ImgCard from "./components/ImgCard"
import Back from "../../global/icon/Back"
import ShoppingCar from "../../global/icon/ShoppingCart"
import Home from "../../global/icon/Home"
/* React Hooks */
import { useEffect, useState } from "react"
import { useParams, Link ,useNavigate } from "react-router-dom"
/* Redux */
import { useSelector } from "react-redux"

/* ======================================== */
/* React Components */
export default function Product() {
    const {id} = useParams()
    const navigate = useNavigate()
    const {account, token} = useSelector(state => state.account)
    const [viewPicture, setViewPicture] = useState(false)
    const [product, setProduct] = useState({})
    const [isAdded, setIsAdded] = useState(false)
    const [isLoading, setIsloading] = useState(true)
    const [isHandling, setIsHandling] = useState(false)
    
    useEffect(() => {
        document.title = `商品 : ${product?.name}`
    }, [product])
    useEffect( () => {
        init()
        window.scroll(0, 0)
        async function init() {
            const {success, commodity} = await API.get(`${API.PRODUCT}?id=${id}`, null)
            if (success) setProduct(commodity)
            else navigate("/NotFound", {replace : true})
            if (token) {
                const {success, isAdded} = await API.get(`${API.CRUD_CART}?id=${id}`, token)
                if (success) setIsAdded(isAdded)
            }
            setIsloading(false)
        }
    }, [navigate, id, token])

    async function submitToCart() {
        if (!account) navigate("/SignIn")
        setIsHandling(true)
        const {success} = isAdded
            ? await API.del(`${API.CRUD_CART}?id=${id}`, token)
            : await API.post(`${API.CRUD_CART}?id=${id}`, token)
        if (success) setIsAdded(prev => !prev)
        setIsHandling(false)
    }
    async function rentImmediately() {
        if (!account) navigate("/SignIn")
        setIsHandling(true)
        const {success} = isAdded
            ? {success : true}
            : await API.post(`${API.CRUD_CART}?id=${id}`, token)
        if (success) navigate(`/Bill/${product?.provider}`)
        setIsHandling(false)
    }

    /* ==================== 分隔線 ==================== */
    return <>
        {
            !viewPicture &&
            <header>
                <div className="flex_center">
                    <Back />
                    <span>商品資訊</span>
                </div>
                <div className="flex_center">
                    <ShoppingCar />
                    <Home />
                </div>
            </header>
        }
        <main className={style.main}>
            {
                (isLoading || isHandling) && 
                <div className="loading-ring" />
            }
            <div className={viewPicture? "": style.top}>
                {
                    !isLoading &&
                    <ImgCard
                        ImgArray={product?.imgs || []}
                        viewPicture={viewPicture}
                        setViewPicture={setViewPicture}
                    />
                }
                {
                    !viewPicture && !isLoading &&
                    <div className={style.info}>
                        <div>{product?.name}</div>
                        <div>$NT{product?.price} / 天</div>
                        <div>
                            <div>
                                <span>- 數量</span>
                                <span>{product?.amount}</span>
                            </div>
                            <div>
                                <span>- 地點</span>
                                <span>{product?.position}</span>
                            </div>
                        </div>
                    </div>
                }
            </div>
            {
                !viewPicture && !isLoading &&
                <div className={style.des}>
                    <div>賣場名稱</div>
                    <div>
                        <div>{product?.provider}</div>
                        <div>
                            <Link to={`/ChatRoom/${product?.provider}`} 
                                style={{visibility: (account && account !== product?.provider)? "visible": "hidden"}}>
                                <button className="button" style={{margin:"0"}}>聊天</button>
                            </Link>
                            <Link to={`/Store/${product?.provider}`}>
                                <button className="button" style={{margin:"0"}}>進入賣場</button>
                            </Link>
                        </div>
                    </div>
                    <div>商品描述</div>
                    <div>{product?.description}</div>
                </div>
            }
        </main>
        {
            !viewPicture && !isLoading && (account !== product?.provider) &&
            <>
                <div className="base" />
                <footer>
                    <button className="button buttonText grow" 
                        onClick={submitToCart} disabled={isLoading || isHandling}>
                        {
                            isAdded?
                            <>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="icon bi bi-cart-dash-fill" viewBox="0 0 16 16">
                                    <path d="M.5 1a.5.5 0 0 0 0 1h1.11l.401 1.607 1.498 7.985A.5.5 0 0 0 4 12h1a2 2 0 1 0 0 4 2 2 0 0 0 0-4h7a2 2 0 1 0 0 4 2 2 0 0 0 0-4h1a.5.5 0 0 0 .491-.408l1.5-8A.5.5 0 0 0 14.5 3H2.89l-.405-1.621A.5.5 0 0 0 2 1H.5zM6 14a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm7 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM6.5 7h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 1 0-1z"/>
                                </svg>
                                <span>移除</span>
                            </>:
                                <>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="icon bi bi-cart-plus-fill" viewBox="0 0 16 16">
                                    <path d="M.5 1a.5.5 0 0 0 0 1h1.11l.401 1.607 1.498 7.985A.5.5 0 0 0 4 12h1a2 2 0 1 0 0 4 2 2 0 0 0 0-4h7a2 2 0 1 0 0 4 2 2 0 0 0 0-4h1a.5.5 0 0 0 .491-.408l1.5-8A.5.5 0 0 0 14.5 3H2.89l-.405-1.621A.5.5 0 0 0 2 1H.5zM6 14a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm7 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM9 5.5V7h1.5a.5.5 0 0 1 0 1H9v1.5a.5.5 0 0 1-1 0V8H6.5a.5.5 0 0 1 0-1H8V5.5a.5.5 0 0 1 1 0z"/>
                                </svg>
                                <span>加入</span>
                            </>
                        }         
                    </button>
                    <button className="button buttonText grow"
                        onClick={rentImmediately} disabled={isLoading || isHandling}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="icon bi bi-cart-fill" viewBox="0 0 16 16">
                            <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
                        </svg>
                        <span>租借</span>
                    </button>
                </footer>
            </>
        }
    </>
}
