const API_URL = process.env.REACT_APP_API_URL
const WS_URL = API_URL

const SIGNUP = `${API_URL}/signup`
const LOGIN = `${API_URL}/login`
const JWT = `${API_URL}/jwt`
const CHATLIST = `${API_URL}/chatlist`
const CHATROOM = `${API_URL}/chatroom`
const ADD_PRODUCT = `${API_URL}/add_product`

const API = {
    WS_URL,
    SIGNUP,
    LOGIN,
    JWT,
    CHATLIST,
    CHATROOM,
    ADD_PRODUCT
}
export default API