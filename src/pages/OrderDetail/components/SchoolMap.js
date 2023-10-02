import style from "./SchoolMap.module.css"
import remote from "../../../navigation_api"
import canvas from "../../../global/functions/canvas"
import { useEffect, useRef, useState } from "react"
import NTUST_MAP from "../../../global/assets/NTUST_MAP.png"

export default function SchoolMap({ destination }) {
    const mapCanvasRef = useRef()
    const routeCanvasRef = useRef()
    const sourceCanvasRef = useRef()
    const destinationCanvasRef = useRef()
    const [nodes, setNodes] = useState({})
    const [inited, setInited] = useState(false)
    const [source, setSource] = useState([121.54110276123953, 25.01349988551148])
    const [route, setRoute] = useState([])
    
    useEffect(() => {
        remote.get_nodes().then(nodes => setNodes(nodes))
        const mapCtx = mapCanvasRef.current.getContext('2d')
        const image = new Image()
        image.src = NTUST_MAP
        image.onload = function() {
            [mapCanvasRef, routeCanvasRef, sourceCanvasRef, destinationCanvasRef]
                .forEach(canvasRef => {
                    const canvas = canvasRef.current
                    canvas.width = image.width
                    canvas.height = image.height
                })
            mapCtx.drawImage(image, 0, 0)
            setInited(true)
        }
    }, [])

    useEffect(() => {
        // 定位功能加這裡
    }, [])
    useEffect(() => {
        if (!inited) return
        remote.directions({source, destination})
            .then(data => {
                const {source_xy, destination_xy, best_path, total_distance} = data
                console.log(total_distance, source_xy)
                setRoute(best_path)
                const sourceCanvas = sourceCanvasRef.current
                const destinationCanvas = destinationCanvasRef.current 
                canvas.clearCanvas(sourceCanvas)
                canvas.drawDot(sourceCanvas, source_xy, 40, "black")
                canvas.clearCanvas(destinationCanvas)
                canvas.drawDot(destinationCanvas, destination_xy, 40, "red")
            })
    }, [inited, source, destination])
    useEffect(() => {
        if (!inited || !route[0]) return
        const routeCanvas = routeCanvasRef.current
        canvas.clearCanvas(routeCanvas)
        route.forEach((id, index) => {
            const pointA = nodes[id].img_coord
            canvas.drawDot(routeCanvas, pointA, 15)
            if (index+1 !== route.length) {
                const pointB = nodes[route[index+1]].img_coord
                canvas.drawLine(routeCanvas, pointA, pointB, 30)
            }
        })
    }, [inited, nodes, route])
    
    /* ======================================== */
    return <>
        <div className={style.map_container}>
            <canvas ref={mapCanvasRef} className={style.ntust_map} />
            <canvas ref={routeCanvasRef} className={style.ntust_map} />
            <canvas ref={sourceCanvasRef} className={style.ntust_map} />
            <canvas ref={destinationCanvasRef} className={style.ntust_map}/>
        </div>
    </>
}
