import { configureStore } from "@reduxjs/toolkit"
import myProductSlice from "./store/myProductSlice"

const store = configureStore({
    reducer : {
        myProduct : myProductSlice
    }
})

export default store