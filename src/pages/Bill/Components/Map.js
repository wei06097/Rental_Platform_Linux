/* import */
/* ======================================== */
/* CSS */
import style from "./Map.module.css"
/* Components */
import Back from "../../../global/icon/Back"
import MapBox from "./MapBox"
import SchoolMap from "./SchooleMap"
/* Hooks */
import { useState } from "react"

/* ======================================== */
export default function Map({ closePage, setLocation, location })  {
    const [inNtust, setInNtust] = useState(true)
    const [result, setResult] = useState(null)
    const [showingDia, setShowingDia] = useState(false)
    /* ==================== 分隔線 ==================== */
    
    return <>
        <div className="page">
            {
                showingDia &&
                <div className={style.mask}>
                    <div>
                        <div>修改地點名稱</div>
                        <input 
                            type="text" 
                            value={result?.name || ""}
                            onChange={(e) => {
                                setResult(prev => {
                                    return {
                                        ...prev,
                                        name : e.target.value
                                    }
                                })
                            }}
                        />
                        <div>
                            <button onClick={() => {setShowingDia(false)}}>取消</button>
                            <button onClick={() => {
                                if (!result?.name) return
                                setLocation(result)
                                closePage()
                            }}>確定</button>
                        </div>
                    </div>
                </div>
            }
            <header>
                <div className="flex_center">
                    <Back 
                        goLastPage={false}
                        closeSubPage={closePage}
                    />
                    <span>選擇地點</span>
                </div>
                <div className="flex_center">
                    <button className="icon-button" style={{width:"max-content"}}
                        onClick={() => {setInNtust(prev => !prev)}}
                    >切換地圖</button>
                    <button className="icon-button"
                        onClick={() => {result? setShowingDia(true): alert("尚未選擇地點")}}
                    >確定</button>
                </div>
            </header>
            {
                inNtust?
                <SchoolMap
                    setResult={setResult}
                    location={location}
                />:
                <MapBox
                    setResult={setResult}
                    location={location}
                />
            }
        </div>
    </>
}
