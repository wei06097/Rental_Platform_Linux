const API_URL = process.env.REACT_APP_API_URL
const WS_URL = API_URL

const SIGNUP = `${API_URL}/signup`
const LOGIN = `${API_URL}/login`
const JWT = `${API_URL}/jwt`
const CHATROOM = `${API_URL}/chatroom`

const API = {
    WS_URL,
    SIGNUP,
    LOGIN,
    JWT,
    CHATROOM
}
export default API