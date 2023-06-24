import API from "../global/API"
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"

/* ============================================================ */
export const doLogin = createAsyncThunk(
    "account/doLogin",
    async (payload, thunkAPI) => {
        try {
            return await API.post(API.LOGIN, null, payload)
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
)
export const doSignup = createAsyncThunk(
    "account/doSignup",
    async (payload, thunkAPI) => {
        try {
            return await API.post(API.SIGNUP, null, payload)
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
)
export const verifyJWT = createAsyncThunk(
    "account/verifyJWT",
    async (payload, thunkAPI) => {
        try {
            const token = thunkAPI.getState().account.token
            return await API.get(API.JWT, token)
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
)

/* ============================================================ */
const initialState = {
    token : "",
    account : "",
    isLogin : false,
    isHandling : false
}

const accountSlice = createSlice({
    name : "account",
    initialState : initialState,
    reducers : {
        doLogout : (state) => {
            // window.location.href = "/"
            return initialState
        }
    },
    extraReducers : (builder) => {
        builder
        /* 登入 */
            .addCase(doLogin.pending, (state) => {
                state.isHandling = true
            })
            .addCase(doLogin.fulfilled, (state, action) => {
                const {success, message, account} = action.payload
                if (success) return {
                    token : message,
                    account : account,
                    isLogin : true,
                    isHandling : false
                }
                alert(message)
                state.isHandling = false
            })
            .addCase(doLogin.rejected, (state, action) => {
                alert(action.payload)
                state.isHandling = false
            })
        /* 註冊 */
            .addCase(doSignup.pending, (state) => {
                state.isHandling = true
            })
            .addCase(doSignup.fulfilled, (state, action) => {
                const {success, message} = action.payload
                if (success) window.location.replace = "/SignIn"
                alert(message)
                state.isHandling = false
            })
            .addCase(doSignup.rejected, (state, action) => {
                alert(action.payload)
                state.isHandling = false
            })
        /* 檢查JWT */
            .addCase(verifyJWT.pending, (state) => {
                state.isHandling = true
            })
            .addCase(verifyJWT.fulfilled, (state, action) => {
                const {success} = action.payload
                if (!success) {
                    window.location.replace = "/SignIn"
                    return {...initialState}
                }
            })
            .addCase(verifyJWT.rejected, (state, action) => {
                alert(action.payload)
                state.isHandling = false
            })
    }
})

/* ============================================================ */
export const { doLogout } = accountSlice.actions
export default accountSlice.reducer
