const WS_URL = process.env.REACT_APP_API_URL

/* ============================================================ */
/* 帳號 */
const SIGNUP = `${WS_URL}/api/userfile/signup/`
const LOGIN = `${WS_URL}/api/userfile/login/`
const JWT = `${WS_URL}/api/userfile/verify_token/`
/* 個人檔案 */
const PROFILE = `${WS_URL}/api/userfile/profile/`
const PASSWORD_CHANGE = `${WS_URL}/api/userfile/password_change/`
/* 賣場 */
const STORE = `${WS_URL}/api/userfile/browse_store/`
const MY_PRODUCTS = `${WS_URL}/api/commodity/my_commodity/`
const CRUD_PRODUCT = `${WS_URL}/api/commodity/commodity_CRUD/`
const LAUNCH_PRODUCT = `${WS_URL}/api/commodity/launch/`
/* 商品 */
const HOMEPAGE = `${WS_URL}/api/commodity/get_launched_commodity/`
const RESULT = `${WS_URL}/api/commodity/get_searched_commodity/`
const PRODUCT = `${WS_URL}/api/commodity/get_commodity/`
/* 聊天 */
const CHAT_HISTORY = `${WS_URL}/api/userfile/history/`
const CHAT_OVERVIEW = `${WS_URL}/api/userfile/overview/`
/* 購物車 */
const CRUD_CART = `${WS_URL}/api/cart/cart_CRUD/`
const MY_CART = `${WS_URL}/api/cart/my_cart/`
const MY_STORECART = `${WS_URL}/api/cart/my_storecart/`
/* 訂單 */
const ORDER = `${WS_URL}/api/order/order_CRUD/`
const OVERVIEW_ORDERS = `${WS_URL}/api/order/overview/`
/* 訂單更新通知 */
const ORDER_NOTIFY = `${WS_URL}/api/order/notify/`
const CHAT_NOTIFY = `${WS_URL}/api/userfile/notify/`

/* ============================================================ */
async function get(url, token) {
    // console.log("get:", url)
    const response = await fetch(url, {
        method: "GET",
        headers: {"Authorization": token}
    })
    const result = await response.json()
    // console.log(result)
    return Promise.resolve(result)
}
async function del(url, token) {
    // console.log("del:", url)
    const response = await fetch(url, {
        method : "DELETE",
        headers : {"Authorization": token}
    })
    const result = await response.json()
    // console.log(result)
    return Promise.resolve(result)
}
async function post(url, token, body) {
    // console.log("post:", url)
    // console.table(body)
    const response = await fetch(url, {
        method : "POST",
        headers : {
            "Authorization": token,
            "Content-Type" : "application/json"
        },
        body : JSON.stringify(body)
    })
    const result = await response.json()
    // console.log(result)
    return Promise.resolve(result)
}
async function put(url, token, body) {
    // console.log("put:", url)
    // console.table(body)
    const response = await fetch(url, {
        method : "PUT",
        headers : {
            "Authorization": token,
            "Content-Type" : "application/json"
        },
        body : JSON.stringify(body)
    })
    const result = await response.json()
    // console.log(result)
    return Promise.resolve(result)
}

/* ============================================================ */
const API = {
    // Method
    get, del, post, put,
    // URL
    WS_URL,
    SIGNUP, LOGIN, JWT,
    PROFILE, PASSWORD_CHANGE,
    STORE, MY_PRODUCTS, CRUD_PRODUCT, LAUNCH_PRODUCT,
    HOMEPAGE, RESULT, PRODUCT,
    CHAT_HISTORY, CHAT_OVERVIEW,
    CRUD_CART, MY_CART, MY_STORECART,
    ORDER, OVERVIEW_ORDERS,
    ORDER_NOTIFY, CHAT_NOTIFY
}
export default API
