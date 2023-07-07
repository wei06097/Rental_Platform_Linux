/* import */
/* ======================================== */
/* CSS */
import style from "./SearchBar.module.css"
/* Hooks */
import { useEffect, useRef } from "react"
import { useNavigate, useLocation } from "react-router"
/* Redux */
import { useDispatch } from "react-redux"
import { queryProducts } from "../../../slice/resultSlice"
/* Function */
export function encodeURLfromArr(array) {
    return array
        .map(param => encodeURIComponent(param))
        .join("%20")
}

/* ======================================== */
export default function SearchBar({ setQueryParams=null }) {
    const KEYNAME = "s"
    const navigate = useNavigate()
    const location = useLocation()
    const dispatch = useDispatch()
    const inputRef = useRef()

    useEffect( () => {
        /* 從網址抓參數 */
        const queryArray = (new URLSearchParams(location.search).get(KEYNAME) || "").split(" ")
        if (setQueryParams) setQueryParams(queryArray)
        inputRef.current.value = queryArray.join(" ")
    }, [location, KEYNAME, setQueryParams])

    function submitHandler(e) {
        e.preventDefault()
        const queryArray = inputRef.current.value
            .split(" ")
            .filter(element => element !== "")
        const queryString = encodeURLfromArr(queryArray)
        // 檢查輸入空白
        if (queryString === "") return
        navigate(`/result?${KEYNAME}=${queryString}`, {replace : !window.location.search})
        dispatch(queryProducts({queryString}))
    }

    /* ==================== 分隔線 ==================== */
    return <>
        <form onSubmit={submitHandler} className={style.search_bar}>
            <input type="text" ref={inputRef} placeholder="輸入關鍵字" />
            <button type="submit">
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="currentColor" className="bi bi-search" viewBox="0 0 16 16">
                    <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
                </svg>
            </button>
        </form>
    </>
}
