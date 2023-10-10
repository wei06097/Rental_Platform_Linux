/* import */
/* ======================================== */
/* CSS */
import style from "./Map.module.css"
/* Hooks */
import { useEffect } from "react"
/* mapbox */
import mapboxgl from 'mapbox-gl'
import * as MapboxDirections from '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions'
import 'mapbox-gl/dist/mapbox-gl.css'
import '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions.css'

/* ======================================== */
mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN

export default function MapBox({ destination }) {
    useEffect(() => {
        const map = new mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [121, 24],
            zoom: 7,
            attributionControl: false,
        })
        const geolocate = new mapboxgl.GeolocateControl({
            positionOptions: { enableHighAccuracy: true },
            trackUserLocation: true,
            showUserHeading: true,
            showAccuracyCircle: false
        })
        const directions = new MapboxDirections({
            accessToken: mapboxgl.accessToken,
            interactive: false,
            alternatives: false,
            unit: 'metric',
            controls: { 
                inputs: true,
                instructions: false
            }
        })

        directions
            .setDestination(destination.center)
        geolocate
            .on('geolocate', (e) => {
                const myLocation = [e.coords.longitude, e.coords.latitude]
                directions.setOrigin(myLocation)
            })
        map
            .addControl(new mapboxgl.NavigationControl())
            .addControl(directions, 'top-left')
            .addControl(geolocate)
            .on('load', async () => {
                geolocate.trigger()
                new mapboxgl.Marker().setLngLat(destination.center).addTo(map)
                map.flyTo({
                    center: destination.center,
                    zoom: (map.getZoom() <= 10)? 14: map.getZoom()
                })
            })
        document.querySelector(".mapboxgl-ctrl-logo").style.display = "none"
        document.querySelector(".mapbox-directions-component-keyline").style.visibility = "hidden"
        return () => {
            map.remove()
        }
    }, [destination])

    /* ==================== 分隔線 ==================== */
    return <>
        <div id="map" className={style.map}>
            <div className = {style.name}>{destination.name}</div>
        </div>
    </>
}
