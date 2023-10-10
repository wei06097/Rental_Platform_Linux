/* import */
/* ======================================== */
/* CSS */
import style from "./MapBox.module.css"
/* Hooks */
import { useState, useEffect, useRef } from "react"
/* mapbox */
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

/* ======================================== */
mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN

async function getLocationName(longitude, latitude, accessToken) {
    const geocodeUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${accessToken}`
    try {
        const response = await fetch(geocodeUrl)
        const data = await response.json()
        if (data.features && data.features.length > 0) {
            const locationName = data.features[0].place_name
            return Promise.resolve(locationName)
        } else {
            return Promise.reject(`Location not found`)
        }
    } catch (error) {
        return Promise.reject(`Error fetching location: ${error}`)
    }
}
async function searchLocations(keyword) {
    const url = 'https://api.mapbox.com/geocoding/v5/mapbox.places/' 
        + encodeURIComponent(keyword)
        + '.json?access_token='
        + mapboxgl.accessToken
    try {
        const response = await fetch(url)
        const data = await response.json()
        if (data.features && data.features.length > 0) {
            const locations = data.features
                .map(element => {
                    return {
                        center : element.center,
                        name : element.place_name
                    }
                })
            return Promise.resolve(locations)
        } else {
            return Promise.resolve([])
        }
    } catch (error) {
        return Promise.reject([`Error fetching location: ${error}`])
    }
}
export default function Map({ setResult, location })  {
    const inputRef = useRef()
    const [mark, setMark] = useState(null)
    const [myMap, setMyMap] = useState(null)
    const [locations, setLocations] = useState([])

    useEffect(() => {
        const map = new mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [121, 24],
            zoom: 7,
            attributionControl: false,
        })
        map
            .addControl(new mapboxgl.NavigationControl())
            .on('load', () => {
                setMyMap(map)
            })
        document.querySelector(".mapboxgl-ctrl-logo").style.display = "none"
        return () => {
            map.remove()
        }
    }, [])
    useEffect(() => {
        if (!myMap) return
        function recordData(location, locationName) {
            inputRef.current.value = locationName
            myMap.flyTo({ center: location, zoom: (myMap.getZoom() <= 10)? 14: myMap.getZoom() })
            const newMark = new mapboxgl.Marker().setLngLat(location).addTo(myMap)
            setMark(mark => {
                if (mark) mark.remove()
                return newMark
            })
            setResult({center : location, name : locationName})
        }
        myMap
            .on('click', async (e) => {
                const location = [e.lngLat.lng, e.lngLat.lat]
                const locationName = await getLocationName(location[0], location[1], mapboxgl.accessToken)
                recordData(location, locationName)
            })
        if (location.name) {
            recordData(location.center, location.name)
        }
    }, [myMap, setResult, location])

    /* ======================================== */
    function clearHandler() {
        setLocations([])
        inputRef.current.value = ""
    }
    async function submitHandler(e) {
        e.preventDefault()
        const keyword = inputRef.current.value
        if (!keyword) return
        setLocations(await searchLocations(keyword))
    }
    function selectHandler(location) {
        setLocations([])
        inputRef.current.value = location.name
        if (!myMap) return
        myMap.flyTo({ center: location.center, zoom: (myMap.getZoom() <= 10)? 14: myMap.getZoom() })
        const newMark = new mapboxgl.Marker().setLngLat(location.center).addTo(myMap)
        if (mark) mark.remove()
        setMark(newMark)
        setResult(location)
    }

    /* ==================== 分隔線 ==================== */
    return <>
        <div className={style.container}>
            <form onSubmit={submitHandler}>
                <input type="text" onChange={() => {setLocations([])}} ref={inputRef}/>
                <input type="submit" value="搜尋" />
                <input type="button" value="清除" onClick={clearHandler} />
            </form>
            <div>
                {
                    locations
                        .map((element, i) => 
                            <div key={i} onClick={() => {selectHandler(element)}}>{element.name}</div>
                        )
                }
            </div>
        </div>
        <div id="map" className={style.map}></div>
    </>
}
