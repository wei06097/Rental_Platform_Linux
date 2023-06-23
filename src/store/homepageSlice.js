import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import API from "../global/API"

/* ============================================================ */
export const getRecommend = createAsyncThunk(
    "homepage/getRecommend",
    async (payload, thunkAPI) => {
        try {
            return await API.get(API.HOMEPAGE, null)
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
)

/* ============================================================ */
const initialState = {
    products : [],
    isLoading : false
}

const homepage = createSlice({
    name : "homepage",
    initialState : initialState,
    reducers : {},
    extraReducers : (builder) => {
        builder
        /* 推薦商品 */
            .addCase(getRecommend.pending, (state) => {
                state.isLoading = true
            })
            .addCase(getRecommend.fulfilled, (state, action) => {
                const {result} = action.payload
                state.products = [...result]
                state.isLoading = false
            })
            .addCase(getRecommend.rejected, (state, action) => {
                console.log(action.payload)
                state.isLoading = false
            })
    }
})

/* ============================================================ */
// export const {} = homepage.actions
export default homepage.reducer
