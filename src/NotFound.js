/* Components: icon */
import Back from "./global/icon/Back"

export default function NotFound() {
    return <>
        <div style={{display: "flex", alignItems: "center", justifyContent: "center"}}>
            <Back />
            <h1 style={{textAlign: "center"}}>404 Not Found</h1>
        </div>
    </>
}