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
import { useNavigate } from "react-router-dom"
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

    useEffect(() => {
        document.title = "我的商品"
        if (window.location.hash === "#refresh") {
            dispatch(getMyProducts())
            navigate(window.location.pathname, {replace : true})
        } else if (!isLogin) {
            navigate("/SignIn", {replace: true})
        } else if (!isChecked) {
            dispatch(getMyProducts())
        } else if (!isLoading) {
            window.scroll(0, scrollY[on? "on": "off"])
        }
    }, [navigate, dispatch, isLogin, isChecked, isLoading, scrollY, on])

    /* ======================================== */
    function changePage(state) {
        if (isHandling || state === on) return
        recordSrcollHandler(!state)
        dispatch(changeOnOff(state))
    }
    function recordSrcollHandler(isOn) {
        const payload = {[isOn? "on": "off"] : window.scrollY}
        dispatch(recordScrollY(payload))
    }

    function reloadHandler() {
        dispatch(getMyProducts())
    }
    function addHandler() {
        recordSrcollHandler(on)
        navigate("/EditProduct/new")
    }
    function editHandler(id) {
        recordSrcollHandler(on)
        navigate(`/EditProduct/${id}`)
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
                product_on.slice().reverse()
                    .map( element =>
                        <Card
                            key={element.id}
                            item={element}
                            launched={true}
                            toEditPage={() => {editHandler(element.id)}}
                        />
                    )
            }
            {
                !isLoading && !on &&
                product_off.slice().reverse()
                    .map( element =>
                        <Card
                            key={element.id}
                            item={element}
                            launched={false}
                            toEditPage={() => {editHandler(element.id)}}
                        />
                    )
            }
        </main>
        <div className="base"/>
        <footer>
            <button className="button grow" disabled={isHandling} onClick={addHandler}>新增商品</button>
        </footer>
    </>
}
