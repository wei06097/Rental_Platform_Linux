/* import */
/* ======================================== */
/* CSS */
import style from "../OrderDetail.module.css"
/* Components */
import Option from "./Option"

/* ======================================== */
export default function ActualArea({ start, end }) {
    return <>
        <div className={style.products} style={{width:"100%", border:"0"}}>
            <div>
                <div className={style.title}>實際交貨時間</div>
                <Option
                    mode={"start"}
                    value={start}
                    setDecision={null}
                    hideRadio={true}
                />
            </div>
            <div>
                <div className={style.title}>實際歸還時間</div>
                <Option
                    mode={"end"}
                    value={end}
                    setDecision={null}
                    hideRadio={true}
                />
            </div>
        </div>
    </>
}
