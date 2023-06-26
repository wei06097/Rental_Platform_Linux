/* import */
/* ======================================== */
/* CSS */
import style from "./SearchBar.module.css"
/* Hooks */
import { useEffect, useRef } from "react"
import { useNavigate, useLocation } from "react-router"

/* ======================================== */
export default function SearchBar({ setQueryParams=null }) {
    const KEYNAME = "s"
    const navigate = useNavigate()
    const location = useLocation()
    const inputRef = useRef()
    
    useEffect( () => {
        const queryParams = (new URLSearchParams(location.search).get(KEYNAME) || "").split(" ")
        if (setQueryParams) setQueryParams(queryParams)
        inputRef.current.value = queryParams.join(" ")
    }, [location, KEYNAME, setQueryParams])
    
    function submitHandler(e) {
        e.preventDefault()
        const queryArray = inputRef.current.value
            .split(" ")
            .filter(element => element !== "")
        const queryString = queryArray
            .map(param => encodeURIComponent(param))
            .join("%20")
        if (queryString !== "") navigate(`/result?${KEYNAME}=${queryString}`)
    }

    /* ==================== 分隔線 ==================== */
    return <>
        <form onSubmit={submitHandler} className={style.search_bar}>
            <input type="text" ref={inputRef}/>
            <button type="submit">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-search" viewBox="0 0 16 16">
                    <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
                </svg>
            </button>
        </form>
    </>
}
