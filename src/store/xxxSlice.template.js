import { current, createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import API from "../global/API"

/* ============================================================ */
export const method = createAsyncThunk(
    "xxx/method",
    async ({id}, thunkAPI) => {
        const token = localStorage.getItem("token") || ""
        try {
            return await API.get(`${API.LAUNCH_PRODUCT}/?id=${id}`, token)
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
)

/* ============================================================ */
const initialState = {

}

const xxxSlice = createSlice({
    name : "xxx",
    initialState : initialState,
    reducers : {},
    extraReducers : (builder) => {
        builder
            .addCase(method.pending, (state) => {

            })
            .addCase(method.fulfilled, (state, action) => {

            })
            .addCase(method.rejected, (state, action) => {

            })
    }
})

/* ============================================================ */
// export const {} = xxxSlice.actions
export default xxxSlice.reducer
