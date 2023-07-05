/* import */
/* ======================================== */
/* CSS */
import style from "./Option.module.css"
import { useRef } from "react"

/* ======================================== */
export default function Option({ mode, value, setDecision, hideRadio, isHandling=false}) {
    const radioRef = useRef()
    const inputRef = useRef()
    
    function radioClickHandler() {
        if (hideRadio || isHandling) return
        setDecision(prev => {
            return {
                ...prev,
                [mode] : inputRef.current.value
            }
        })
    }
    function labelClickHandler() {
        if (hideRadio || isHandling) return
        radioRef.current.checked = true
        radioClickHandler()
    }

    /* ==================== 分隔線 ==================== */
    return <>
        <div className={style.option}>
            {
                !hideRadio &&
                <input type="radio" name={mode} ref={radioRef} 
                    onClick={radioClickHandler} disabled={isHandling} />
            }
            <label onClick={labelClickHandler}>
                {
                    (mode !== "position")
                    ?<input type="datetime-local" disabled={true} value={value} ref={inputRef}/>
                    :<input type="text" disabled={true} value={value} ref={inputRef}/>
                }
            </label>
        </div>
    </>
}
