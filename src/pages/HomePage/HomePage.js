/* import */
/* ======================================== */
/* CSS */
import style from "./HomePage.module.css"
/* Functions */
import AccountActions from "../../global/functions/AccountActions"
/* Components */
import SearchBar from "../../global/components/SearchBar"
import OverviewCards from "../../global/components/OverviewCards"
/* header 的按鈕 */
import ShoppingCart from "../../global/icon/ShoppingCart"
import Message from "../../global/icon/Message"
import User from "../../global/icon/User"
/* React Hooks */
import { useSocket } from "../../global/hooks/SocketProvider"
import { useState, useEffect, useLayoutEffect } from "react"

/* ======================================== */
/* Functions */
let counter = 0
function fetchData() {
    let array = [], number=20
    for (let i=0; i<number; i++) {
        counter += 1
        array = [...array, counter]
    }
    return array
}

/* React Components */
export default function HomePage() {
    const socket = useSocket()
    useEffect( () => {
        socket.on("verify-token", () => {
            const token = localStorage.getItem("token")
            socket.emit("verify-token", token, (data) => {
                console.log(data)
            })
        })
    }, [socket])

    const [logined, setLogined] = useState(false)
    const [Array, setArray] = useState(fetchData())
    useEffect( () => {
        window.addEventListener("scroll", moreProducts)
        function moreProducts() {
            const body = document.body
            const bottomDistance = body.scrollHeight + body.getBoundingClientRect().y
            if (bottomDistance < 1000) {
                const newArray = fetchData()
                setArray(prevArray => [...prevArray, ...newArray])
            }
        }
        return () => {
            window.removeEventListener('scroll', moreProducts)
        }
    }, [])
    useLayoutEffect(() => {
        document.title = "台科大租借平台"
        checkLogin()
        async function checkLogin() {
            setLogined(await AccountActions.check())
        }
    }, [])
    /* ==================== 分隔線 ==================== */
    return <>
        <header className="header3">
            <div>
                <div className="flex_center">
                    <h1 className={style.logo}>台科大租借平台</h1>
                </div>
                <div className="flex_center">
                    <ShoppingCart />
                    <Message />
                    <User logined={logined} setLogined={setLogined} />
                </div>
            </div>
            <SearchBar />
        </header>
        <main className="main">
            <div className={style.announcement_area}>
                <div className={style.img}>
                    <img src="https://dengekidaioh.jp/archives/003/201908/7abf06c543302ba23fa6e35a50db895b.png" alt=""></img>
                </div>
            </div>
            <OverviewCards>
                {
                    Array.map( element => 
                        <OverviewCards.ProductCard
                            key={element}
                            link={"https://cf.shopee.tw/file/7547aa6b546059505722d474287b8371"}
                            name={"三顆星彩色冒險 三顆星彩色冒險 三顆星彩色冒險 三顆星彩色冒險"}
                            price={"100"}
                            showHeart={true}
                        />
                    )
                }
            </OverviewCards>
        </main>
    </>
}