/* Constant */
import API from "../API"

/* Functions */
async function signup(body) {
    const response = await fetch(API.SIGNUP, {
        method : "POST",
        headers : { "Content-Type" : "application/json" },
        body : JSON.stringify(body)
    })
    const result = await response.json()
    if (result?.message) alert(result?.message || "error")
    if (result?.success) window.location.href = "/SignIn"
}
async function login(body) {
    const response = await fetch(API.LOGIN, {
        method : "POST",
        headers : { "Content-Type" : "application/json" },
        body : JSON.stringify(body)
    })
    const result = await response.json()
    if (result?.success) {
        localStorage.setItem("token", result?.message || "")
        localStorage.setItem("account", result?.account || "")
        window.location.href = "/"
    } else {
        alert(result?.message || "error")
    }
}
function logout() {
    localStorage.setItem("token", "")
    localStorage.setItem("account", "")
    window.location.href = "/"
}
async function check() {
    const token = localStorage.getItem("token")
    const account = localStorage.getItem("account")
    if (!token || !account) return false
    const response = await fetch(API.JWT, {
        method: "GET",
        headers: { token : token }
    })
    const result = await response.json()
    return Promise.resolve(result?.success || false)
}

const AccountActions = {
    signup,
    login,
    logout,
    check
}
export default AccountActions