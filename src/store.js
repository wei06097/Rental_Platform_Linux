import thunk from "redux-thunk"
import { combineReducers } from "@reduxjs/toolkit"
import { configureStore } from "@reduxjs/toolkit"
import { persistReducer, persistStore } from "redux-persist"
import storage from "redux-persist/lib/storage"
import storageSession from "redux-persist/lib/storage/session"

import accountSlice from "./slice/accountSlice"
import homepageSlice from "./slice/homepageSlice"
import resultSlice from "./slice/resultSlice"
import storeSlice from "./slice/storeSlice"
import myProductSlice from "./slice/myProductSlice"
import editProductSlice from "./slice/editProductSlice.js"
import globalSlice from "./slice/globalSlice"

/* ======================================== */
const account_PersistConfig = {
    key : "account",
    storage : storage
}
const homepage_PersistConfig = {
    key : "homepage",
    storage : storageSession
}
const result_PersistConfig = {
    key : "result",
    storage : storageSession
}
const store_PersistConfig = {
    key : "store",
    storage : storageSession
}

/* ======================================== */
const reducer = combineReducers({
    account : persistReducer(account_PersistConfig, accountSlice),
    homepage : persistReducer(homepage_PersistConfig, homepageSlice),
    result : persistReducer(result_PersistConfig, resultSlice),
    store :  persistReducer(store_PersistConfig, storeSlice),
    myProduct : myProductSlice,
    editProduct : editProductSlice,
    global : globalSlice
})
const store = configureStore({
    reducer : reducer,
    middleware : [thunk]
})

/* ======================================== */
export const persistor = persistStore(store)
export default store

/* 偵測其他分頁是否執行登入/登出動作，並同步 account 的 state */
window.addEventListener("storage", (event) => {
    if (event.key !== "account") return
    const oldState = JSON.parse(event.oldValue)
    const newState = JSON.parse(event.newValue)
    if (!oldState.isLogin && newState.isLogin) {
        // 登入
        store.dispatch({
            type : "account/writeState",
            payload : newState
        })
    } else if (oldState.isLogin && !newState.isLogin) {
        // 登出
        store.dispatch({
            type : "account/resetState"
        })
    }
})
