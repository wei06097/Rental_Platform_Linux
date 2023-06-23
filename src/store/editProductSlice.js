import { createSlice } from "@reduxjs/toolkit"

/* ============================================================ */
const initialState = {
    isLoading : false
}

const editProductSlice = createSlice({
    name : "editProduct",
    initialState : initialState,
    reducers : {},
    extraReducers : (builder) => {

    }
})

/* ============================================================ */
// export const {} = editProductSlice.actions
export default editProductSlice.reducer
