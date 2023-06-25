import API from "../API"
import { current, createSlice, createAsyncThunk } from "@reduxjs/toolkit"

/* ============================================================ */
export const getStoreInfo = createAsyncThunk(
    "storeSlice/getStoreInfo",
    async ({seller}, thunkAPI) => {
        try {
            const token = thunkAPI.getState().account.token
            return await API.get(`${API.STORE}/?seller=${seller}`, token)
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message)
        }
    }
)

/* ============================================================ */
const initialState = {
    store : {},
    isExist : true,
    isLoading : false,
}

const storeSlice = createSlice({
    name : "store",
    initialState : initialState,
    reducers : {
        resetExistState : (state) => {
            state.isExist = true
        }
    },
    extraReducers : (builder) => {
        builder
            .addCase(getStoreInfo.pending, (state) => {
                state.isLoading = true
            })
            .addCase(getStoreInfo.fulfilled, (state, action) => {
                const {success, provider, products} = action.payload
                if (success) {
                    const data = {
                        [window.location.pathname] : {
                            provider : provider,
                            products : products
                        }
                    }
                    const history = current(state.store)
                    state.store = {...history, ...data}
                } else {
                    state.isExist = false
                }
                state.isLoading = false
            })
            .addCase(getStoreInfo.rejected, (state, action) => {
                state.isLoading = false
            })
    }
})

/* ============================================================ */
export const { resetExistState } = storeSlice.actions
export default storeSlice.reducer
