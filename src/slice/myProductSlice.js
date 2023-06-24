import API from "../global/API"
import { current, createSlice, createAsyncThunk } from "@reduxjs/toolkit"

/* ============================================================ */
export const getMyProducts = createAsyncThunk(
    "myProduct/getMyProducts",
    async (payload, thunkAPI) => {
        try {
            const token = thunkAPI.getState().account.token
            return await API.get(API.MY_PRODUCTS, token)
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
)
export const deleteProduct = createAsyncThunk(
    "myProduct/deleteProduct",
    async ({id}, thunkAPI) => {
        try {
            const token = thunkAPI.getState().account.token
            return await API.del(`${API.CRUD_PRODUCT}/?id=${id}`, token)
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
)
export const launchProduct = createAsyncThunk(
    "myProduct/launchProduct",
    async ({id, launched}, thunkAPI) => {
        try {
            const token = thunkAPI.getState().account.token
            return await API.put(`${API.LAUNCH_PRODUCT}/?id=${id}`, token, {launched})
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
)

/* ============================================================ */
const initialState = {
    on : true,
    scrollY : 0,
    products : {
        product_on : [],
        product_off : []
    },
    isLoading : false,
    isHandling : false,
    isRefreshed : false
}

const myProductSlice = createSlice({
    name : "myProduct",
    initialState : initialState,
    reducers : {
        changeOnOff : (state, action) => {
            state.on = action.payload
        },
        recordScrollY : (state, action) => {
            state.scrollY = action.payload
        },
        reloadTab : (state) => {
            state.isRefreshed = false
        }
    },
    extraReducers : (builder) => {
        builder
        /* 查看所有商品 */
            .addCase(getMyProducts.pending, (state) => {
                state.isLoading = true
            })
            .addCase(getMyProducts.fulfilled, (state, action) => {
                const { success, avl_products, na_products } = action.payload
                if (success) {
                    state.products = {
                        product_on : [...avl_products],
                        product_off : [...na_products]
                    }
                    state.isRefreshed = true
                    state.isLoading = false
                } else {
                    window.location.replace("/SignIn")
                    return {...initialState}
                }
            })
            .addCase(getMyProducts.rejected, (state, action) => {
                console.log(action.payload)
                state.isLoading = false
            })
        /* 刪除商品 */
            .addCase(deleteProduct.pending, (state) => {
                state.isHandling = true
            })
            .addCase(deleteProduct.fulfilled, (state, action) => {
                const {success, id} = action.payload
                if (success) {
                    const {on, products} = current(state)
                    const {product_on, product_off} = products
                    if (on) {
                        const newArray = product_on
                            .filter(element => Number(element.id) !== Number(id))
                        state.products.product_on = [...newArray]
                    } else {
                        const newArray = product_off
                            .filter(element => Number(element.id) !== Number(id))
                        state.products.product_off = [...newArray]
                    }
                } else {
                    alert("刪除時發生錯誤")
                }
                state.isHandling = false
            })
            .addCase(deleteProduct.rejected, (state, action) => {
                console.log(action.payload)
                state.isHandling = false
            })
        /* 上/下架商品 */
            .addCase(launchProduct.pending, (state) => {
                state.isHandling = true
            })
            .addCase(launchProduct.fulfilled, (state, action) => {
                const {success, id} = action.payload
                const {on, products} = current(state)
                const {product_on, product_off} = products
                if (success) {
                    if (on) {
                        const newArray1 = product_on
                            .filter(element => Number(element.id) !== Number(id))
                        const newArray2 = product_on
                            .filter(element => Number(element.id) === Number(id))
                            .concat(product_off)
                        state.products.product_on = [...newArray1]
                        state.products.product_off = [...newArray2]
                    } else {
                        const newArray1 = product_off
                            .filter(element => Number(element.id) === Number(id))
                            .concat(product_on)
                        const newArray2 = product_off
                            .filter(element => Number(element.id) !== Number(id))
                        state.products.product_on = [...newArray1]
                        state.products.product_off = [...newArray2]
                    }
                } else {
                    alert("操作時發生錯誤")
                }
                state.isHandling = false
            })
            .addCase(launchProduct.rejected, (state, action) => {
                console.log(action.payload)
                state.isHandling = false
            })
    }
})

/* ============================================================ */
export default myProductSlice.reducer
export const { changeOnOff, recordScrollY, reloadTab } = myProductSlice.actions
