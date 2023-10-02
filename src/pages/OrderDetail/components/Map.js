/* import */
/* ======================================== */
/* Components */
import Back from "../../../global/icon/Back"
/* Hooks */
import { useState } from "react"
/* Components */
import MapBox from "./MapBox"
import SchoolMap from "./SchoolMap"

/* ======================================== */
export default function Map({ closePage, destination }) {
    const [inNtust, setInNtust] = useState(true)
    /* ==================== 分隔線 ==================== */
    return <>
        <div className="page">
            <header>
                <div className="flex_center">
                    <Back 
                        goLastPage={false}
                        closeSubPage={closePage}
                    />
                    <span>導航</span>
                </div>
                <div>
                    <button className="icon-button" style={{width:"max-content"}}
                        onClick={() => {setInNtust(prev => !prev)}}
                    >切換地圖</button>
                </div>
            </header>
            {
                inNtust?
                <SchoolMap
                    destination={destination.center}
                />:
                <MapBox
                    destination={destination}
                />
            }
        </div>
    </>
}
