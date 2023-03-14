const API_URL = process.env.REACT_APP_API_URL
const WS_URL = API_URL

const SIGNUP = `${API_URL}/signup`
const LOGIN = `${API_URL}/login`
const JWT = `${API_URL}/jwt`

const CHAT_LIST = `${API_URL}/chat_list`
const CHAT_HISTORY = `${API_URL}/chat_history`

const ADD_PRODUCT = `${API_URL}/add_product`
const EDIT_PRODUCT = `${API_URL}/edit_product`
const SAVE_PRODUCT = `${API_URL}/save_product`

const MY_PRODUCTS = `${API_URL}/my_products`
const DELETE_PRODUCT = `${API_URL}/delete_product`
const LAUNCH_PRODUCT = `${API_URL}/launch_product`

const STORE = `${API_URL}/store`
const PRODUCT = `${API_URL}/product`
const HOMEPAGE = `${API_URL}/homepage`
const RESULT = `${API_URL}/result`

export async function get(url) {
    const response = await fetch(url)
    const result = await response.json()
    return Promise.resolve(result)
}
export async function post(url, body) {
    const response = await fetch(url, {
        method : "POST",
        headers : { "Content-Type" : "application/json" },
        body : JSON.stringify(body)
    })
    const result = await response.json()
    return Promise.resolve(result)
}

const API = {
    // function
    get, post,
    // constant
    WS_URL,
    SIGNUP, LOGIN, JWT,
    CHAT_LIST, CHAT_HISTORY,
    ADD_PRODUCT, EDIT_PRODUCT, SAVE_PRODUCT,
    MY_PRODUCTS, DELETE_PRODUCT, LAUNCH_PRODUCT,
    STORE, PRODUCT, HOMEPAGE, RESULT
}
export default API