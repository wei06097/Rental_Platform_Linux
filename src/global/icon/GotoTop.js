import { useState, useEffect } from "react"

export default function GotoTop() {
    const [isVisible, setIsVisible] = useState(false)
    
    useEffect(() => {
        const offset = 100
        setIsVisible(window.scrollY > offset)
        function scrollHandler() {
            setIsVisible(window.scrollY > offset)
        }
        window.addEventListener("scroll", scrollHandler)
        return () => {
            window.removeEventListener("scroll", scrollHandler)
        }
    }, [isVisible])

    function handler() {
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: "smooth"
        })
    }

    /* ==================== 分隔線 ==================== */
    return <>
        <button className="float-button gotoTop" onClick={handler} style={{display:isVisible?"block":"none"}}>
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" className="bi bi-arrow-up" viewBox="0 0 16 16">
                <path fillRule="evenodd" d="M8 15a.5.5 0 0 0 .5-.5V2.707l3.146 3.147a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L7.5 2.707V14.5a.5.5 0 0 0 .5.5z"/>
            </svg>
        </button>
    </>
}
