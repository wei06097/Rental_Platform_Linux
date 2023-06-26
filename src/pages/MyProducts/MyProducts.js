/* import */
/* ======================================== */
/* Components */
import Back from "../../global/icon/Back"
import Home from "../../global/icon/Home"
import Card from "./Components/Card"
import Reload from "../../global/icon/Reload"
import GotoTop from "../../global/icon/GotoTop"
/* Hooks */
import { useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
/* Redux */
import { useSelector, useDispatch } from "react-redux"
import { changeOnOff, recordScrollY, getMyProducts } from "../../slice/myProductSlice"

/* ======================================== */
export default function MyProducts() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const {isLogin} = useSelector(state => state.account)
    const {on, scrollY, products, isLoading, isHandling, isChecked} = useSelector(state => state.myProduct)
    const {product_on, product_off} = products
    const isNothing = ((product_on?.length || 0) + (product_off?.length || 0)) === 0

    useEffect(() => {
        document.title = "我的商品"
    }, [])
    useEffect(() => {
        if (!isLogin) navigate("/SignIn", {replace: true})
        else if (isNothing && !isChecked) dispatch(getMyProducts())
    }, [navigate, dispatch, isLogin, isNothing, isChecked])
    
    function changePage(state) {
        if (isHandling || state === on) return
        const target = scrollY
        dispatch(recordScrollY(window.scrollY))
        dispatch(changeOnOff(state))
        setTimeout(() => {
            window.scroll(0, target)
        }, 10)
    }
    function reloadHandler() {
        dispatch(getMyProducts())
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
            <GotoTop />
            <Reload reloadHandler={reloadHandler} />
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
