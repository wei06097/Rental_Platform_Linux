import API from "../API"
import { current, createSlice, createAsyncThunk } from "@reduxjs/toolkit"

/* ============================================================ */
export const method = createAsyncThunk(
    "xxx/method",
    async ({id}, thunkAPI) => {
        try {
            const token = thunkAPI.getState().account.token
            return await API.get(`${API.LAUNCH_PRODUCT}/?id=${id}`, token)
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message)
        }
    }
)

/* ============================================================ */
const initialState = {
    isLoading : false
}

const storeSlice = createSlice({
    name : "xxx",
    initialState : initialState,
    reducers : {},
    extraReducers : (builder) => {
        builder
            .addCase(xxx.pending, (state) => {
                state.isLoading = true
            })
            .addCase(xxx.fulfilled, (state, action) => {
                console.log(action.payload)
                state.isLoading = false
            })
            .addCase(xxx.rejected, (state, action) => {
                state.isLoading = false
            })
    }
})

/* ============================================================ */
// export const {} = xxxSlice.actions
export default xxxSlice.reducer
