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
let online = {}

io.on('connection', socket => {
    let user = null

    socket.on("login", (token, account) => {
        if (!token || !account) return
        try {
            const decode = jwt.verify(token, JWT_SECRET)
            const success = decode?.account === account
            if (!success) return
        } catch {
            return
        }
        user = account
        if (!online[user]) online[user] = []
        online[user].push(socket.id)
        console.log(online)
    })
    
    socket.on("disconnect", () => {
        if (!user) return
        const index = online[user].indexOf(socket.id)
        if (index !== -1) online[user].splice(index, 1)
        if (!online[user][0]) delete online[user]
        console.log(online)
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
    res.json( {success, message, account} )
})
app.get('/jwt', async (req, res) => {
    const token = req?.headers?.token || ""
    let account = null, success = true
    try {
        /* 要再去資料庫拿資料驗證帳號 但是我懶 */
        const decode = jwt.verify(token, JWT_SECRET)
        account = decode?.account || ""
    } catch {
        success = false
    }
    res.json( {success, account} )
})

/* ======================================== */
server.listen(PORT, HOST, () => {
    console.log("\n===== Start =====")
    console.log(`at ${HOST}:${PORT}\n`)
})