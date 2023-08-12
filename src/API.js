const API_URL = process.env.REACT_APP_API_URL
const WS_URL = API_URL

/* ============================================================ */
/* 帳號 */
const SIGNUP = `${API_URL}/api/userfile/signup/`
const LOGIN = `${API_URL}/api/userfile/login/`
const JWT = `${API_URL}/api/userfile/verify_token/`
/* 個人檔案 */
const PROFILE = `${API_URL}/api/userfile/profile/`
const PASSWORD_CHANGE = `${API_URL}/api/userfile/password_change/`
/* 賣場 */
const STORE = `${API_URL}/api/userfile/browse_store/`
const MY_PRODUCTS = `${API_URL}/api/commodity/my_commodity/`
const CRUD_PRODUCT = `${API_URL}/api/commodity/commodity_CRUD/`
const LAUNCH_PRODUCT = `${API_URL}/api/commodity/launch/`
/* 商品 */
const HOMEPAGE = `${API_URL}/api/commodity/get_launched_commodity/`
const RESULT = `${API_URL}/api/commodity/get_searched_commodity/`
const PRODUCT = `${API_URL}/api/commodity/get_commodity/`
/* 聊天 */
const CHAT_LIST = `${API_URL}/api/chat/list/`
const CHAT_HISTORY = `${API_URL}/api/chat/history/`
const CHAT_OVERVIEW = `${API_URL}/api/chat/overview/`
/* 購物車 */
const CRUD_CART = `${API_URL}/api/cart/cart_CRUD/`
const MY_CART = `${API_URL}/api/cart/my_cart/`
const MY_STORECART = `${API_URL}/api/cart/my_storecart/`
/* 訂單 */
const ORDER = `${API_URL}/api/order/order_CRUD/`
const OVERVIEW_ORDERS = `${API_URL}/api/order/overview/`

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
    CHAT_LIST, CHAT_HISTORY, CHAT_OVERVIEW,
    CRUD_CART, MY_CART, MY_STORECART,
    ORDER, OVERVIEW_ORDERS
}
export default API
