/* Components: icon */
import Back from "../global/icon/Back"
import Home from "../global/icon/Home"

export default function NotFound() {
    return <>
        <header>
            <div className="flex_center">
                <Back />
                <div>Go Back</div>
            </div>
            <div className="flex_center">
                <Home />
            </div>
        </header>
        <main style={{height: "calc(100vh - var(--height))"}}>
            <div style={{height:"50%", display:"grid", placeItems:"center"}}>
                <h1 style={{fontSize: "50px"}}>404 Not Found</h1>
            </div>
        </main>
    </>
}
