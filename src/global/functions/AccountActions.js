/* Constant */
import API from "../API"

/* Functions */
async function signup(body, callback) {
    const response = await fetch(API.SIGNUP, {
        method : "POST",
        headers : { "Content-Type" : "application/json" },
        body : JSON.stringify(body)
    })
    const result = await response.json()
    if (result?.message) alert(result?.message || "error")
    if (result?.success) callback()
}
async function login(body, callback) {
    const response = await fetch(API.LOGIN, {
        method : "POST",
        headers : { "Content-Type" : "application/json" },
        body : JSON.stringify(body)
    })
    const result = await response.json()
    if (result?.success && result?.message) {
        localStorage.setItem("token", result.message)
        callback()
    } else {
        alert(result?.message || "error")
    }
}
async function check() {
    const token = localStorage.getItem("token")
    if (!token) return false
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
    check
}
export default AccountActions