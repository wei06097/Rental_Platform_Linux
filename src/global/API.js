const API_URL = process.env.REACT_APP_API_URL
const WS_URL = API_URL

const SIGNUP = `${API_URL}/signup`
const LOGIN = `${API_URL}/login`
const JWT = `${API_URL}/jwt`
const CHATLIST = `${API_URL}/chatlist`
const CHATROOM = `${API_URL}/chatroom`
const ADD_PRODUCT = `${API_URL}/add_product`

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
    get,
    post,
    // constant
    WS_URL,
    SIGNUP,
    LOGIN,
    JWT,
    CHATLIST,
    CHATROOM,
    ADD_PRODUCT
}
export default API