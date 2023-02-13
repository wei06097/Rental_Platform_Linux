/* CSS */
import style from "../Product.module.css"

/* React Hooks */
import { useEffect, useRef } from "react"

/* React Components */
let presentPage = 1, displacement = 0, startPosition = 0

export default function ImgCard({ ImgArray }) {
    const container = useRef()
    useEffect( () => {
        container.current.setAttribute("page", `${presentPage}/${ImgArray.length}`)
    }, [ImgArray])
    function onPointerdown() {
        displacement = 0
        startPosition = container.current.scrollLeft
        window.addEventListener("pointerup", onPointerup)
        window.addEventListener("pointermove", onPointermove)
    }
    function onPointermove(e) {
        const width = container.current.querySelector("div").getBoundingClientRect().width
        const start = (presentPage - 1) * width
        displacement += e.movementX * -1
        if (Math.abs(startPosition - start) > 5) return
        container.current.scrollLeft = startPosition + displacement
    }
    function onPointerup() {
        if (displacement > 2 && presentPage !== ImgArray.length) {
            presentPage += 1
        } else if (displacement < -2 && presentPage !== 1) {
            presentPage -= 1
        }
        const width = container.current.querySelector("div").getBoundingClientRect().width
        const goal = (presentPage - 1) * width
        container.current.setAttribute("page", `${presentPage}/${ImgArray.length}`)
        container.current.scrollTo({'behavior': 'smooth', 'left': goal})
        window.removeEventListener("pointermove", onPointermove)
        window.removeEventListener("pointerup", onPointerup)
    }
    return <>
        <div className={style.product_imgs} onPointerDown={onPointerdown} ref={container} page="">
            {
                ImgArray.map( (element, i) => {
                    return <div key={i}>
                        <img src={element} alt="" />
                    </div>
                })
            }
        </div>
    </>
}