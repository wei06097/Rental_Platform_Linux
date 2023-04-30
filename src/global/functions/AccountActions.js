/* Constant */
import API from "../API"

/* Functions */
async function signup(body) {
    const {success, message} = await API.post(API.SIGNUP, null, body)
    alert(message || "error")
    if (success) window.location.href = "/SignIn"
}
async function login(body) {
    const {success, message, account} = await API.post(API.LOGIN, null, body)
    if (success) {
        localStorage.setItem("token", message || "")
        localStorage.setItem("account", account || "")
        // 為了讓socket重新連線，必須重新整理
        window.location.href = "/"
    } else {
        alert(message || "error")
    }
}
function logout() {
    localStorage.setItem("token", "")
    localStorage.setItem("account", "")
    // 為了讓socket重新連線，必須重新整理
    window.location.href = "/"
}
async function check() {
    const token = localStorage.getItem("token")
    if (!token) return false
    const {success, account} = await API.get(API.JWT, token)
    localStorage.setItem("token", success? token: "")
    localStorage.setItem("account", success? account: "")
    return Promise.resolve(success || false)
}

const AccountActions = {
    signup,
    login,
    logout,
    check
}
export default AccountActions