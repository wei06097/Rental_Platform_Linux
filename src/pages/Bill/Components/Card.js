/* import */
/* ======================================== */
/* CSS */
import style from "./Card.module.css"
/* API */
import API from "../../../API"
/* Hooks */
import { useState, useEffect, useRef } from "react"
import { Link } from "react-router-dom"

/* ======================================== */
export default function Card({ element, noBorder, payload, setPayload }) {
    const [number, setNumber] = useState(1)
    const [loaded, setLoaded] = useState(false)
    const imgRef = useRef()
    const max = element.amount
    
    useEffect(() => {
        if (!payload[element.id]) {
            setPayload(prev => {
                return {
                    ...prev,
                    [element.id] : {
                        amount : Number(1),
                        price : element.price
                    }
                }
            })
        }
    }, [element, payload, setPayload])
    useEffect(() => {
        const imgElement = imgRef.current
        const loaded = () => setLoaded(true)
        imgElement.addEventListener("load", loaded)
        if (imgElement.complete) setLoaded(true)
        return () => {
            imgElement.removeEventListener("load", loaded)
        }
    }, [])

    function changeNumber(isAdd) {
        setNumber(prev => {
            let data = isAdd? prev+1: prev-1
            data = (data > max)? max: (data < 1)? 1: data
            return Number(data)
        })
        setPayload(prev => {
            let data = isAdd? prev[element.id].amount+1: prev[element.id].amount-1
            data = (data > max)? max: (data < 1)? 1: data
            return {
                ...prev,
                [element.id] : {
                    amount : Number(data),
                    price : element.price
                }
            }
        })
    }
    
    /* ==================== 分隔線 ==================== */
    return <>
        <div className={style.card} style={noBorder? {border:"0"}: {}}>
            <Link className={`link ${style.name}`} to={`/Product/${element.id}`}>
                {element.name}
            </Link>
            <Link className={`link ${style.img}`} to={`/Product/${element.id}`}>
                {!loaded && <div className="fill skeleton" />}
                <img
                    ref={imgRef}
                    style={{opacity:loaded?1:0}} loading="eager" alt=""
                    src={`${API.WS_URL}/${element.cover}`}
                />
            </Link>
            <div className={style.price}>
                NT${Number(number) * Number(element.price)}
            </div>
            <div className={style.number}>
                <button onClick={() => {changeNumber(false)}}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="icon bi bi-dash-circle-fill" viewBox="0 0 16 16">
                        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM4.5 7.5a.5.5 0 0 0 0 1h7a.5.5 0 0 0 0-1h-7z"/>
                    </svg>
                </button>
                <div>{number}/ {max}</div>
                <button onClick={() => {changeNumber(true)}}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="icon bi bi-plus-circle-fill" viewBox="0 0 16 16">
                        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3v-3z"/>
                    </svg>
                </button>
            </div>
        </div>
    </>
}
