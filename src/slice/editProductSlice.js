import API from "../API"
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"

/* ============================================================ */
export const getInfo = createAsyncThunk(
    "editProduct/getInfo",
    async ({id}, thunkAPI) => {
        try {
            const token = thunkAPI.getState().account.token
            return await API.get(`${API.CRUD_PRODUCT}/?id=${id}`, token)
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message)
        }
    }
)
export const submit = createAsyncThunk(
    "editProduct/submit",
    async ({mode, payload}, thunkAPI) => {
        try {
            const token = thunkAPI.getState().account.token
            const id = thunkAPI.getState().editProduct.data.id
            payload = {
                ...payload,
                remain_imgs : thunkAPI.getState().editProduct.data.remain_imgs,
                imgs : thunkAPI.getState().editProduct.data.imgs
            }
            return (mode === "add")
                ? await API.post(API.CRUD_PRODUCT, token, payload)
                : await API.put(`${API.CRUD_PRODUCT}/?id=${id}`, token, payload)
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message)
        }
    }
)

/* ============================================================ */
const initialState = {
    data : {
        id : 0,
        remain_imgs : [],
        imgs : [],
        name : "",
        description : "",
        price : 0,
        amount : 0,
        position : ""
    },
    isAccessible : true,
    isLoading : false, //載入跟提交
    isCompleted : false, //完成提交
}

const editProductSlice = createSlice({
    name : "editProduct",
    initialState : initialState,
    reducers : {
        addImg : (state, action) => {
            const number = state.data.remain_imgs.length + state.data.imgs.length
            if (number < 5) state.data.imgs.push(action.payload)
        },
        delImg : (state, action) => {
            const order = action.payload
            const oldImg = state.data.remain_imgs
            const newImg = state.data.imgs
            state.data.remain_imgs = oldImg
                .filter((element, i) => { return i!==order })
            state.data.imgs = newImg
                .filter((element, i) => { return i+oldImg.length!==order })
        },
        resetState : (state) => {
            return {...initialState}
        }
    },
    extraReducers : (builder) => {
        builder
        /* 載入商品資訊 */
            .addCase(getInfo.pending, (state) => {
                state.isLoading = true
            })
            .addCase(getInfo.fulfilled, (state, action) => {
                const {success, info} = action.payload
                if (!success) {
                    state.isAccessible = false
                } else {
                    state.data = {
                        id : info.id,
                        remain_imgs : [...info.imgs],
                        imgs : [],
                        name : info.name,
                        description : info.description,
                        price : Number(info.price),
                        amount : Number(info.amount),
                        position : info.position
                    }
                }
                state.isLoading = false
            })
            .addCase(getInfo.rejected, (state, action) => {
                state.isLoading = false
            })
        /* 繳交 */
            .addCase(submit.pending, (state) => {
                state.isLoading = true
            })
            .addCase(submit.fulfilled, (state, action) => {
                const {success} = action.payload
                if (success) state.isCompleted = true
                state.isLoading = false
            })
            .addCase(submit.rejected, (state, action) => {
                state.isLoading = false
            })
    }
})

/* ============================================================ */
export const { addImg, delImg, resetState } = editProductSlice.actions
export default editProductSlice.reducer
