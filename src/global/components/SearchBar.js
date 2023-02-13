/* CSS */
import style from "./SearchBar.module.css"

/* React Hooks */
import { useEffect, useRef } from "react"
import { useNavigate, useLocation } from "react-router"

/* Functions */

/* React Components */
export default function SearchBar() {
    const navigate = useNavigate()
    const path = useLocation()    
    const input = useRef()
    useEffect( () => {
        const result = decodeURI(path.search.split("?s=")[1] || "")
        input.current.value = result
    }, [path])
    function search(e) {
        e.preventDefault()
        const result = input.current.value
        if (result !== "") navigate(`/result?s=${result}`)
    }
    return <>
        <form onSubmit={search} className={style.search_bar}>
            <input type="text" ref={input}/>
            <button type="submit">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-search" viewBox="0 0 16 16">
                    <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
                </svg>
            </button>
        </form>
    </>
}