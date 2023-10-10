/* import */
/* ======================================== */
import style from "./SchooleMap.module.css"
import remote from "../../../navigation_api"
import canvas from "../../../global/functions/canvas"
import { useEffect, useRef } from "react"
import NTUST_MAP from "../../../global/assets/NTUST_MAP.png"

/* ======================================== */
export default function SchoolMap({ setResult, location }) {
    const mapCanvasRef = useRef()
    const drawCanvasRef = useRef()

    useEffect(() => {
        const ctx = mapCanvasRef.current.getContext('2d')
        const image = new Image()
        image.src = NTUST_MAP
        image.onload = function() {
            [mapCanvasRef, drawCanvasRef].forEach(element => {
                const canvas = element.current
                canvas.width = image.width
                canvas.height = image.height
            })
            ctx.drawImage(image, 0, 0)
            if (!location) return
            setResult(location)
            remote.transform({
                coord: {Geo: location.center}
            }).then(({coord}) => {
                const myCanvas = drawCanvasRef.current
                canvas.drawDot(myCanvas, coord.Img, 40, 'red')
            })
        }
    }, [setResult, location])
    function mapClickHandler(e) {
        const myCanvas = drawCanvasRef.current
        const image = e.target
        const clickX = e.clientX - image.getBoundingClientRect().left
        const clickY = e.clientY - image.getBoundingClientRect().top
        const img_coord = canvas.htmlSize_To_realSize(myCanvas, [clickX, clickY])
        remote.transform({
            coord: {Img: img_coord}
        }).then(({coord}) => {
            setResult({center: coord.Geo, name: "台科大"})
        })
        canvas.clearCanvas(myCanvas)
        canvas.drawDot(myCanvas, img_coord, 40, 'red')
    }
    
    /* ======================================== */
    return <>
        <div className={style.map_container}>
            <canvas ref={mapCanvasRef} className={style.ntust_map}/>
            <canvas ref={drawCanvasRef} className={style.ntust_map}
                onClick={mapClickHandler} />
        </div>
    </>
}
