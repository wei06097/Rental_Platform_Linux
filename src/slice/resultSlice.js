import API from "../API"
import { current, createSlice, createAsyncThunk } from "@reduxjs/toolkit"

/* ============================================================ */
export const queryProducts = createAsyncThunk(
    "result/queryProducts",
    async ({queryString}, thunkAPI) => {
        try {
            return  {
                key : queryString,
                data : await API.get(`${API.RESULT}?keyword=${queryString}`, null)
            }
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message)
        }
    }
)

/* ============================================================ */
const initialState = {
    history : {},
    isLoading : false,
}

const resultSlice = createSlice({
    name : "result",
    initialState : initialState,
    reducers : {},
    extraReducers : (builder) => {
        builder
            .addCase(queryProducts.pending, (state) => {
                state.isLoading = true
            })
            .addCase(queryProducts.fulfilled, (state, action) => {
                const {key, data} = action.payload
                let history = current(state.history)
                history = {
                    ...history,
                    [key] : data
                }
                state.history = history
                state.isLoading = false
            })
            .addCase(queryProducts.rejected, (state, action) => {
                state.isLoading = false
            })
    }
})

/* ============================================================ */
// export const {} = resultSlice.actions
export default resultSlice.reducer
