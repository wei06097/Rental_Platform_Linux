/* import */
/* ======================================== */
/* CSS */
import style from "../OrderDetail.module.css"
/* Components */
import Option from "./Option"

/* ======================================== */
export default function OptionsArea({ isProvider, options, setDecision, isHandling }) {
    return <>
        <div className={style.products} style={{width:"100%", border:"0"}}>
            <div>
                <div className={style.title}>
                    {isProvider? "選擇交貨時間": "期望交貨時間"}
                </div>
                {
                    options && 
                    options["start"]
                        .map((datetime, i) => {
                            return <Option
                                key={i}
                                mode={"start"}
                                value={datetime}
                                setDecision={setDecision}
                                hideRadio={!isProvider}
                                isHandling={isHandling}
                            />  
                        })
                }
            </div>
            <div>
                <div className={style.title}>
                    {isProvider? "選擇歸還時間": "期望歸還時間"}
                </div>
                {
                    options && 
                    options["end"]
                        .map((datetime, i) => {
                            return <Option
                                key={i}
                                mode={"end"}
                                value={datetime}
                                setDecision={setDecision}
                                hideRadio={!isProvider}
                                isHandling={isHandling}
                            />  
                        })
                }
            </div>
        </div>
        <div className={style.title}>
            {isProvider? "選擇交貨地點": "期望交貨地點"}
        </div>
        {
            options && 
            options["position"]
                .map((position, i) => {
                    return <Option
                        key={i}
                        mode={"position"}
                        value={position}
                        setDecision={setDecision}
                        hideRadio={!isProvider}
                        isHandling={isHandling}
                    />
                })
        }
        <div className={style.products} />
    </>
}
