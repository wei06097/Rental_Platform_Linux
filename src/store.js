import thunk from "redux-thunk"
import { combineReducers } from "@reduxjs/toolkit"
import { configureStore } from "@reduxjs/toolkit"
import { persistReducer, persistStore } from "redux-persist"
import storage from "redux-persist/lib/storage"
import storageSession from "redux-persist/lib/storage/session"

import accountSlice from "./store/accountSlice"
import homepageSlice from "./store/homepageSlice"
import myProductSlice from "./store/myProductSlice"
import editProductSlice from "./store/editProductSlice.js"

/* ======================================== */
const account_PersistConfig = {
    key : "account",
    storage : storage
}
const homepage_PersistConfig = {
    key : "homepage",
    storage : storageSession
}
const myProduct_PersistConfig = {
    key : "myProduct",
    storage : storageSession
}

/* ======================================== */
const reducer = combineReducers({
    account : persistReducer(account_PersistConfig, accountSlice),
    homepage : persistReducer(homepage_PersistConfig, homepageSlice),
    myProduct : persistReducer(myProduct_PersistConfig, myProductSlice),
    editProduct : editProductSlice
})
const store = configureStore({
    reducer : reducer,
    middleware : [thunk]
})

/* ======================================== */
export const persistor = persistStore(store)
export default store
