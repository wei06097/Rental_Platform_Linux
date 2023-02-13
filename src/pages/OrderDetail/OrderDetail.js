/* CSS */
import style from "./OrderDetail.module.css"

/* Components */
import DetailCards from "../../global/components/DetailCards"

/* header 的按鈕 */
import Back from "../../global/icon/Back"

/* React Hooks */
import { useEffect, useRef } from "react"

/* Functions */

/* React Components */
export default function OrderDetail() {
    const comment = useRef()
    useEffect( () => {
        document.title = "訂單詳情"
        comment.current.innerText = `● JANコード：4545784068700
    
    ● 預約本商品須支付訂金$600或全額付清。(※標題含超取免訂金之商品除外)
            
    ● 免訂金商品：每人限購1個，2個以上須支付訂金。`
    }, [])
    return <>
        <header>
            <div className="flex_center">
                <Back />
                <span>訂單詳情</span>
            </div>
        </header>
        <main className="main">
            <div className={style.state}>訂單已完成</div>
            <div className={style.usercards}>
                <div className={style.seller}>
                    <div>
                        <span>賣家</span>
                        <span>名稱</span>
                    </div> 
                    <div>
                        <span>手機</span>
                        <span>09xx xxx xxx</span>
                    </div> 
                    <div>
                        <span>信箱</span>
                        <span>123@gmail.com</span>
                    </div>
                    <div>
                        <span>地點、時間</span>
                        <span>請使用聊天室確認</span>
                    </div>
                </div>
                <div className={style.client}>
                    <div>
                        <span>買家</span>
                        <span>名稱</span>
                    </div> 
                    <div>
                        <span>手機</span>
                        <span>09xx xxx xxx</span>
                    </div> 
                    <div>
                        <span>信箱</span>
                        <span>123@gmail.com</span>
                    </div>
                    <div>
                        <span>地點、時間</span>
                        <span>請使用聊天室確認</span>
                    </div>
                </div>
                <div className={style.comment}>
                    <div>買家留言</div>
                    <div ref={comment}></div>
                </div>
            </div>
            <DetailCards>
                <DetailCards.ProductCard />
                <DetailCards.ProductCard />
                <DetailCards.ProductCard />
            </DetailCards>
        </main>
    </>
}