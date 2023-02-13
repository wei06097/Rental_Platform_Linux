/* Components */
import OrderCards from "../../global/components/OrderCards"

/* header 的按鈕 */
import Back from "../../global/icon/Back"
import Home from "../../global/icon/Home"

/* React Hooks */
import { useState, useEffect } from "react"

/* Functions */
function fetchState(state) {
    switch (state) {
        case 1:
            return {
                state: state,
                data: [
                    {
                        provider: "賣場1",
                        products: [
                            {
                                name: "三顆星彩色冒險 123456789",
                                price: "100",
                                img: "https://p2.bahamut.com.tw/B/2KU/24/5a2da8c378bcd8df6058bd663f3zi104.JPG"
                            },
                            {
                                name: "三顆星彩色冒險 123456789 jack queen king",
                                price: "200",
                                img: "https://cs-a.ecimg.tw/items/QFCD2TD900AG1HU/000001_1607050060.jpg"
                            }
                        ]
                    },
                    {
                        provider: "賣場2",
                        products: [
                            {
                                name: "三顆星彩色冒險 三顆星彩色冒險三顆星彩色冒險 三顆星彩色冒險三顆星彩色冒險三顆星彩色冒險 三顆星彩色冒險三顆星彩色冒險三顆星彩色冒險三顆星彩色冒險",
                                price: "300",
                                img: "https://p2.bahamut.com.tw/B/2KU/81/7a0a9e4060eb012ad158db62cdazbwd4.JPG"
                            }
                        ]
                    },
                    {
                        provider: "賣場3",
                        products: [
                            {
                                name: "三顆星彩色冒險 - 1 - test",
                                price: "400",
                                img: "https://image.ruten.com.tw/g2/0/db/56/21824204845910_848.jpg"
                            },
                            {
                                name: "三顆星彩色冒險 - 2 - test",
                                price: "500",
                                img: "https://image.ruten.com.tw/g2/3/e8/94/21824207143060_522.jpg"
                            },
                            {
                                name: "三顆星彩色冒險 - 3 - test",
                                price: "600",
                                img: "https://image.ruten.com.tw/g2/a/ba/4a/21807686765130_133.jpg"
                            }
                        ]
                    }
                ]
            }
        case 2:
            return {
                state: state,
                data: [
                    {
                        provider: "賣場2",
                        products: [
                            {
                                name: "三顆星彩色冒險 三顆星彩色冒險三顆星彩色冒險 三顆星彩色冒險三顆星彩色冒險三顆星彩色冒險 三顆星彩色冒險三顆星彩色冒險三顆星彩色冒險三顆星彩色冒險",
                                price: "300",
                                img: "https://p2.bahamut.com.tw/B/2KU/81/7a0a9e4060eb012ad158db62cdazbwd4.JPG"
                            }
                        ]
                    },
                    {
                        provider: "賣場3",
                        products: [
                            {
                                name: "三顆星彩色冒險 - 1 - test",
                                price: "400",
                                img: "https://image.ruten.com.tw/g2/0/db/56/21824204845910_848.jpg"
                            },
                            {
                                name: "三顆星彩色冒險 - 2 - test",
                                price: "500",
                                img: "https://image.ruten.com.tw/g2/3/e8/94/21824207143060_522.jpg"
                            },
                            {
                                name: "三顆星彩色冒險 - 3 - test",
                                price: "600",
                                img: "https://image.ruten.com.tw/g2/a/ba/4a/21807686765130_133.jpg"
                            }
                        ]
                    }
                ]
            }
        case 4:
            return {
                state: state,
                data: [
                    {
                        provider: "賣場2",
                        products: [
                            {
                                name: "三顆星彩色冒險 三顆星彩色冒險三顆星彩色冒險 三顆星彩色冒險三顆星彩色冒險三顆星彩色冒險 三顆星彩色冒險三顆星彩色冒險三顆星彩色冒險三顆星彩色冒險",
                                price: "300",
                                img: "https://p2.bahamut.com.tw/B/2KU/81/7a0a9e4060eb012ad158db62cdazbwd4.JPG"
                            }
                        ]
                    }
                ]
            }
        default: 
            return {
                state: state,
                data: []
            }
    }
}

/* React Components */
export default function MyShopping() {
    const [list, setList] = useState([])
    const [state, setState] = useState(1)
    useEffect( () => {
        document.title = "購買清單"
        setList(fetchState(1))
    }, [])
    useEffect( () => {
        setState(parseInt(list.state))
    }, [list])
    function changeState(e) {
        setList(fetchState(parseInt(e.target.id)))
    }
    return <>
        <header className="header2">
            <div>
                <div className="flex_center">
                    <Back />
                    <span>購買清單</span>
                </div>
                <div className="flex_center">
                    <Home />
                </div>
            </div>
            <div>
                <div id="1" onClick={changeState} className={state===1? "selected": ""}>待確認</div>
                <div id="2" onClick={changeState} className={state===2? "selected": ""}>待收貨</div>
                <div id="3" onClick={changeState} className={state===3? "selected": ""}>待歸還</div>
                <div id="4" onClick={changeState} className={state===4? "selected": ""}>已完成</div>
                <div id="5" onClick={changeState} className={state===5? "selected": ""}>不成立</div>
            </div>
        </header>
        <main className="main">
            {
                (list?.data?.length > 0)
                ? list.data.map( (store, i) =>
                    <OrderCards
                        key={i}
                        provider={store?.provider || ""}>
                        <OrderCards.ProductCard
                            state={state}
                            isClient={true}
                            product={store?.products[0] || null}
                            amount={store?.products?.length || 0}
                        />
                    </OrderCards>
                )
                : <OrderCards.NoOrder />
            }
        </main>
    </>
}