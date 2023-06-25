/* import */
/* ======================================== */
/* Components */
import Back from "../../global/icon/Back"
import Home from "../../global/icon/Home"
import Card from "./Components/Card"
/* Hooks */
import { useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
/* Redux */
import { useSelector, useDispatch } from "react-redux"
import { changeOnOff, recordScrollY, getMyProducts, setRefreshed } from "../../slice/myProductSlice"

/* ======================================== */
export default function MyProducts() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const {isLogin} = useSelector(state => state.account)
    const {on, scrollY, products, isLoading, isHandling, isRefreshed} = useSelector(state => state.myProduct)
    const {product_on, product_off} = products

    useEffect(() => {
        document.title = "我的商品"
    }, [])
    useEffect(() => {
        // 進入頁面
        if (!isLogin) navigate("/SignIn", {replace: true})
        else if (!isRefreshed) dispatch(getMyProducts())
    }, [navigate, dispatch, isLogin, isRefreshed])
    useEffect(() => {
        // 重新整理
        function reloadHandler(e) {
            e.preventDefault()
            dispatch(setRefreshed(false))
        }
        window.addEventListener('beforeunload', reloadHandler)
        return () => {
            window.removeEventListener('beforeunload', reloadHandler)
        }
    }, [dispatch])

    function changePage(state) {
        if (isHandling) return
        const target = scrollY
        dispatch(recordScrollY(window.scrollY))
        dispatch(changeOnOff(state))
        setTimeout(() => {
            window.scroll(window.scrollX, target)
        }, 10)
    }

    /* ==================== 分隔線 ==================== */
    return <>
        <header className="header2">
            <div>
                <div className="flex_center">
                    <Back />
                    <span>我的商品</span>
                </div>
                <div>
                    <Home />
                </div>
            </div>
            <div>
                <div onClick={() => { changePage(true) }} 
                    className={`grow ${on? "selected": ""}`}>已上架</div>
                <div onClick={() => { changePage(false) }}
                    className={`grow ${!on? "selected": ""}`}>未上架</div>
            </div>
        </header>
        <main className="main">
            {   
                (isLoading || isHandling) &&
                <div className = "loading-ring" />
            }
            {
                !isLoading && !(on? product_on: product_off)[0] &&
                <div style={{textAlign: "center"}}>沒有商品</div>
            }
            {
                !isLoading && on &&
                product_on
                    .map( element =>
                        <Card
                            key={element.id}
                            item={element}
                            launched={true}
                            toEditPage={() => {navigate(`/EditProduct/${element.id}`)}}
                        />
                    )
            }
            {
                !isLoading && !on &&
                product_off.map( element =>
                    <Card
                        key={element.id}
                        item={element}
                        launched={false}
                        toEditPage={() => {navigate(`/EditProduct/${element.id}`)}}
                    />
                )
            }
        </main>
        <div className="base"/>
        <footer>
            <Link className="link flex_center grow" to="/EditProduct/new">
                <button className="button grow" disabled={isHandling}>新增商品</button>
            </Link>
        </footer>
    </>
}
