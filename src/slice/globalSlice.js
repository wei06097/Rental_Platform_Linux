import { createSlice } from "@reduxjs/toolkit"
/* ============================================================ */
const initialState = {
    orderPage : 0
}

const globalSlice = createSlice({
    name : "global",
    initialState : initialState,
    reducers : {
        setOrderPage : (state, action) => {
            state.orderPage = action.payload
        }
    }
})

/* ============================================================ */
export const { setOrderPage } = globalSlice.actions
export default globalSlice.reducer
