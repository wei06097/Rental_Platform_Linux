const API_URL = process.env.REACT_APP_API_URL
const WS_URL = API_URL

/* ============================================================ */
/* 帳號 */
const SIGNUP = `${API_URL}/api/signup`
const LOGIN = `${API_URL}/api/login`
const JWT = `${API_URL}/api/token_verify`
/* 賣場 */
const STORE = `${API_URL}/store`
const MY_PRODUCTS = `${API_URL}/api/commodity/my_commodity`
const CRUD_PRODUCT = `${API_URL}/api/commodity/commodity_CRUD`
const LAUNCH_PRODUCT = `${API_URL}/launch_product`
/* 商品 */
const HOMEPAGE = `${API_URL}/homepage`
const RESULT = `${API_URL}/result`
const PRODUCT = `${API_URL}/product`
/* 聊天 */
const CHAT_LIST = `${API_URL}/chat_list`
const CHAT_HISTORY = `${API_URL}/chat_history`
/* 購物車 */
const CRUD_CART = `${API_URL}/cart/cart_CRUD`

/* ============================================================ */
async function get(url, token) {
    const response = await fetch(url, {
        method: "GET",
        headers: {"Authorization": token}
    })
    const result = await response.json()
    return Promise.resolve(result)
}
async function del(url, token) {
    const response = await fetch(url, {
        method : "DELETE",
        headers : {"Authorization": token}
    })
    const result = await response.json()
    return Promise.resolve(result)
}
async function post(url, token, body) {
    const response = await fetch(url, {
        method : "POST",
        headers : {
            "Authorization": token,
            "Content-Type" : "application/json"
        },
        body : JSON.stringify(body)
    })
    const result = await response.json()
    return Promise.resolve(result)
}
async function put(url, token, body) {
    const response = await fetch(url, {
        method : "PUT",
        headers : {
            "Authorization": token,
            "Content-Type" : "application/json"
        },
        body : JSON.stringify(body)
    })
    const result = await response.json()
    return Promise.resolve(result)
}

/* ============================================================ */
const API = {
    // Method
    get, del, post, put,
    // URL
    WS_URL,
    SIGNUP, LOGIN, JWT,
    STORE, MY_PRODUCTS, CRUD_PRODUCT, LAUNCH_PRODUCT,
    HOMEPAGE, RESULT, PRODUCT,
    CHAT_LIST, CHAT_HISTORY,
    CRUD_CART
}
export default API
