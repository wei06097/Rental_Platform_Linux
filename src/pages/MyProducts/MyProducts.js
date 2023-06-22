/* import */
/* ======================================== */
/* CSS */
import style from "./MyProducts.module.css"
/* header 的按鈕 */
import Back from "../../global/icon/Back"
import Home from "../../global/icon/Home"
/* Components */
import Card from "./Components/Card"
/* React Hooks */
import { useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { changeOnOff, recordScrollY, getMyProducts } from "../../store/myProductSlice"

/* ======================================== */
export default function MyProducts() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const state = useSelector(state => state.myProduct)
    const {on, scrollY, products, isLoading, isHandling} = state
    const {product_on, product_off} = products

    useEffect( () => {
        document.title = "我的商品"
        dispatch(getMyProducts())
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
            <Link className={`${style.link} flex_center grow`} to="/EditProduct/new">
                <button className="button grow" disabled={isHandling}>新增商品</button>
            </Link>
        </footer>
    </>
}
