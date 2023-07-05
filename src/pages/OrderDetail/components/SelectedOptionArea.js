/* import */
/* ======================================== */
/* CSS */
import style from "../OrderDetail.module.css"
/* Components */
import Option from "./Option"

/* ======================================== */
export default function SelectedOptionArea({ option }) {
    return <>
        <div className={style.products} style={{width:"100%", border:"0"}}>
            <div>
                <div className={style.title}>預期交貨時間</div>
                <Option
                    mode={"start"}
                    value={option?.start || ""}
                    setDecision={null}
                    hideRadio={true}
                /> 
            </div>
            <div>
                <div className={style.title}>預期歸還時間</div>
                <Option
                    mode={"end"}
                    value={option?.end || ""}
                    setDecision={null}
                    hideRadio={true}
                />
            </div>
        </div>
        <div className={style.title}>預期交貨地點</div>
        <Option
            mode={"position"}
            value={option?.position || ""}
            setDecision={null}
            hideRadio={true}
        />
        <div className={style.products} />
    </>
}
