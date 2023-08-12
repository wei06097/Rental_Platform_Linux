import API from "../API"
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"

/* ============================================================ */
export const getRecommend = createAsyncThunk(
    "homepage/getRecommend",
    async (payload, thunkAPI) => {
        try {
            return await API.get(API.HOMEPAGE, null)
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message)
        }
    }
)

/* ============================================================ */
const initialState = {
    products : [],
    isLoading : false,
    isChecked : false
}

const homepage = createSlice({
    name : "homepage",
    initialState : initialState,
    reducers : {
        resetIsChecked : (state) => {
            state.isChecked = false
        }
    },
    extraReducers : (builder) => {
        builder
        /* 推薦商品 */
            .addCase(getRecommend.pending, (state) => {
                state.isLoading = true
            })
            .addCase(getRecommend.fulfilled, (state, action) => {
                state.products = [...action.payload]
                state.isChecked = true
                state.isLoading = false
            })
            .addCase(getRecommend.rejected, (state, action) => {
                console.log(action.payload)
                state.isLoading = false
            })
    }
})

/* ============================================================ */
export const { resetIsChecked } = homepage.actions
export default homepage.reducer
