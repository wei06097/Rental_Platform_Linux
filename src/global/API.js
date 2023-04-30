const API_URL = process.env.REACT_APP_API_URL
const WS_URL = API_URL

/* ============================================================ */
const SIGNUP = `${API_URL}/api/signup`
const LOGIN = `${API_URL}/api/login`
const JWT = `${API_URL}/api/token_verify`

const CRUD_PRODUCT = `${API_URL}/api/commodity/commodity_CRUD`
const MY_PRODUCTS = `${API_URL}/api/commodity/my_commodity`
const LAUNCH_PRODUCT = `${API_URL}/launch_product`
// const ADD_PRODUCT = `${API_URL}/api/commodity/commodity_CRUD`
// const EDIT_PRODUCT = `${API_URL}/edit_product`
// const SAVE_PRODUCT = `${API_URL}/save_product`
// const DELETE_PRODUCT = `${API_URL}/delete_product`

const STORE = `${API_URL}/store`
const PRODUCT = `${API_URL}/product`
const HOMEPAGE = `${API_URL}/homepage`
const RESULT = `${API_URL}/result`

const CHAT_LIST = `${API_URL}/chat_list`
const CHAT_HISTORY = `${API_URL}/chat_history`

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
    // function
    get, del, post, put,
    // constant
    WS_URL,
    SIGNUP, LOGIN, JWT,
    CRUD_PRODUCT, MY_PRODUCTS, LAUNCH_PRODUCT, // ADD_PRODUCT, EDIT_PRODUCT, SAVE_PRODUCT, DELETE_PRODUCT,
    STORE, PRODUCT, HOMEPAGE, RESULT,
    CHAT_LIST, CHAT_HISTORY
}
export default API