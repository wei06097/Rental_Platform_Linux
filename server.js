/* ======================================== */
require('dotenv').config()
const express = require('express')
const cors = require('cors')
const jwt = require('jsonwebtoken')
const fetch = require('node-fetch')

/* ======================================== */
const JWT_SECRET = process.env.ACCESS_TOKEN_SECRET
const HOST = process.env.HOST
const PORT = process.env.SERVER_PORT
const DB_URL = "http://127.0.0.1:5000"

const app = express()
app.use(cors())
app.use(express.json())

const server = require('http').Server(app)
const io = require('socket.io')(server, {cors: {origin: "*"}})

/* ======================================== */
let sockets = {}

io.on('connection', socket => {
    let key = null
    socket.on("login", account => {
        key = account
        if (!sockets[key]) sockets[key] = []
        sockets[key].push(socket.id)
    })
    socket.on("logout", () => {
        if (!key) return
        delete sockets[key]
        key = null
    })
    socket.on("disconnect", () => {
        if (!key) return
        const index = sockets[key].indexOf(socket.id)
        if (index > -1) sockets[key].splice(index, 1)
        const length = sockets[key].length
        if (length === 0) delete sockets[key]
    })
})

/* ======================================== */
app.post("/signup", async (req, res) => {
    const {account} = req.body
    let response = await fetch(`${DB_URL}/accounts?account=${account}`)
    let result = await response.json()
    let success = false, message = ""
    if (result[0]) {
        success = false
        message = "帳號已經被註冊"
    } else {
        response = await fetch(`${DB_URL}/accounts`, {
            method : "POST",
            headers : { "Content-Type" : "application/json" },
            body : JSON.stringify(req.body)
        })
        result = await response.json()
        success = result?.account === account
        message = (success)? "註冊成功": "註冊失敗"
    }
    res.json( {success, message} )
})
app.post("/login", async (req, res) => {
    const {account, password} = req.body
    const response = await fetch(`${DB_URL}/accounts?account=${account}`)
    const result = await response.json()
    const success = (account === result[0]?.account) && (password === result[0]?.password)
    let message = ""
    if (!result[0]) message = "尚未註冊"
    else if (!success) message = "登入失敗"
    else message = jwt.sign(result[0], JWT_SECRET)
    res.json( {success, message} )
})
app.get('/jwt', async (req, res) => {
    const token = req?.headers?.token || ""
    let user = {}, success = false
    try {
        /* 要再去資料庫拿資料驗證帳號 但是我懶 */
        const decode = jwt.verify(token, JWT_SECRET)
        user = {
            username : decode?.username || "",
            account : decode?.account || ""
        }
        success = true
    } catch {
        user = {}
        success = false
    }
    res.json( {success, user} )
})

/* ======================================== */
server.listen(PORT, HOST, () => {
    console.log("\n===== Start =====")
    console.log(`at ${HOST}:${PORT}\n`)
})