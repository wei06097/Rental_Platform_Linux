/* CSS */
import style from "./Number.module.css"

/* React Hooks */
import { useState, useRef } from "react"

/* React Components */
const MIN = 1, MAX = 9999
export default function Number() {
    const input = useRef()
    const [number, setNumber] = useState(1)
    function selectText() {
        input.current.select()
    }
    function onNumberChange() {
        if (input.current.value === "") setNumber(MIN)
        else {
            let value = parseInt(input.current.value)
            value = ((value >= MIN) && (value <= MAX))? value: value % 10
            setNumber(value)
        }
    }
    function upCount() {
        setNumber(prev => (parseInt(prev) >= MAX)? MAX: parseInt(prev) + 1)
    }
    function downCount() {
        setNumber(prev => (parseInt(prev) <= MIN)? MIN: parseInt(prev) - 1)
    }
    return <>
        <div className={style.input_number}>
            <button onClick={downCount}>-</button>
            <input type="number" min={MIN} max={MAX} value={number} 
                onChange={onNumberChange} onClick={selectText} ref={input}/>
            <button onClick={upCount}>+</button>
        </div>
    </>
}