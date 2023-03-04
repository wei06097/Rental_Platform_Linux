/* ======================================== */
require('dotenv').config()
const express = require('express')
const cors = require('cors')
const jwt = require('jsonwebtoken')
const fetch = require('node-fetch')
const fs = require('fs')

/* ======================================== */
const JWT_SECRET = process.env.ACCESS_TOKEN_SECRET
const HOST = process.env.HOST
const PORT = process.env.SERVER_PORT
const DB_URL = "http://127.0.0.1:5000"

const app = express()
app.use(cors())
app.use(express.json({limit: '50mb'}))
const server = require('http').Server(app)
const io = require('socket.io')(server, {cors: {origin: "*"}})

/* ======================================== */
let online = {}

io.on('connection', socket => {
    let user = null
    socket.on("login", (token, account) => {
        if (!token || !account) return
        const data = decodeToken(token)
        const success = (data?.account === account)
        if (!success) return
        user = account
        if (!online[user]) online[user] = []
        online[user].push(socket.id)
        // console.log(online)
    })
    socket.on("disconnect", () => {
        if (!user) return
        const index = online[user].indexOf(socket.id)
        if (index !== -1) online[user].splice(index, 1)
        if (!online[user][0]) delete online[user]
        // console.log(online)
    })
    socket.on("message", async ({provider, receiver, type, content, img}) => {
        // 檢查傳送者身分
        if (!online[provider]) return
        const correct = online[provider].some(myId => myId === socket.id)
        if (!correct) return
        // 處理訊息
        const current = new Date().toLocaleString('zh-TW', {
            timeZone: 'Asia/Taipei', hour12: false,
            day: '2-digit', month: '2-digit', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        })
        const [date, time] = current.split(" ")
        const src = (type == "img")? await saveImg(img, true): ""
        const message = (type == "img")
            ?{provider, receiver, type, src, date, time}
            :{provider, receiver, type, content, date, time}
        // 丟到資料庫
        await fetch(`${DB_URL}/chat_history`, {
            method : "POST",
            headers : { "Content-Type" : "application/json" },
            body : JSON.stringify(message)
        })
        // 傳給自己
        online[provider].forEach(myId => {
            io.sockets.sockets.get(myId).emit("message", message)
        })
        // 傳給對方
        if (provider === receiver) return
        if (!online[receiver]) return
        online[receiver].forEach(targetId => {
            io.sockets.sockets.get(targetId).emit("message", message)
        })
    })
})

/* Functions */
/* ======================================== */
// 儲存圖片並回傳子網址
async function saveImg(img, doSave) {
    // 取得資料庫的計數器 (圖片檔案編號)
    const response = await fetch(`${DB_URL}/parameter`)
    const params = await response.json()
    const number = parseInt(params?.img_counter)
    // 更新資料庫的計數器
    await fetch(`${DB_URL}/parameter`, {
        method: "PATCH",
        headers : { "Content-Type" : "application/json" },
        body : JSON.stringify({img_counter : number + 1})
    })
    // 儲存圖片到 img 資料夾
    const type = img.replace("data:image/","").split(";")[0]
    const path = `${__dirname}\\img\\${number}.${type}`
    const data = img.replace(/^data:image\/\w+;base64,/, "")
    const buf = Buffer.from(data, 'base64')
    if (doSave) fs.writeFile(path, buf, () => {})
    // 回傳子網址
    return Promise.resolve(`img/${number}.${type}`)
}
// 將token解密
function decodeToken(token) {
    try {
        return jwt.verify(token, JWT_SECRET)
    } catch {
        return {}
    }
}

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
        const payload = {...req.body, nickname: account}
        response = await fetch(`${DB_URL}/accounts`, {
            method : "POST",
            headers : { "Content-Type" : "application/json" },
            body : JSON.stringify(payload)
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
app.post('/jwt', async (req, res) => {
    const {token} = req.body
    const {account} = decodeToken(token)
    const success = account? true: false
    res.json( {success, account} )
})

/* ======================================== */
// 回傳聊天歷史紀錄
app.post('/chat_history', async (req, res) => {
    const {token, receiver} = req.body
    const user = decodeToken(token)
    const provider = user?.account
    let response = await fetch(`${DB_URL}/accounts?account=${receiver}`)
    let result = await response.json()
    if (!result[0] || !provider || !receiver || provider === receiver) {
        res.json({success : false, history : null})
        return
    }
    const query = `provider=${provider}&receiver=${receiver}&provider=${receiver}&receiver=${provider}`
    response = await fetch(`${DB_URL}/chat_history?${query}`)
    result = await response.json()
    res.json( {success : true, history : result} )
})
// 回傳所有帳號
app.post('/chat_list', async (req, res) => {
    const {token} = req.body
    const user = decodeToken(token)
    const provider = user?.account
    let response = await fetch(`${DB_URL}/accounts?account=${provider}`)
    let result = await response.json()
    if (!result[0]) {
        res.json({success : false, list : null})
        return
    }
    response = await fetch(`${DB_URL}/accounts?account_ne=${provider}`)
    result = await response.json()
    result = result.map( user => {
        const account = user?.account
        return {account}
    })
    res.json( {success : true, list : result} )
})
// 顯示圖片
app.get('/img/:name', async (req, res) => {
    const Picture = `${__dirname}\\img\\${req.params.name}`
    const NotFound = `${__dirname}\\img\\NotFound.jpeg`
    fs.readFile(Picture, (err) => {
        res.sendFile(err? NotFound: Picture)
    })
})

/* ======================================== */
// 新增商品
app.post('/add_product', async (req, res) => {
    const {token, launched, imgs, name, description, price, amount, position} = req.body
    // 驗證身分
    const {account} = decodeToken(token)
    let response = await fetch(`${DB_URL}/accounts?account=${account}`)
    let result = await response.json()
    if (!result[0]) {
        res.json( {success : false} )
        return
    }
    // 儲存上傳的圖片
    let urls = []
    for (let i=0; i<imgs.length; i++) {
        const url = await saveImg(imgs[i], true)
        urls.push(url)
    }
    // 處理產品資訊
    const product = {
        provider : account, launched, imgs : urls,
        name, description, price, amount, position
    }
    // 丟到資料庫
    response = await fetch(`${DB_URL}/products`, {
        method : "POST",
        headers : { "Content-Type" : "application/json" },
        body : JSON.stringify(product)
    })
    res.json( {success : true} )
})
// 取得商品(編輯用)
app.post('/edit_product', async (req, res) => {
    const {token, id} = req.body
    const {account} = decodeToken(token)
    if (!account) {
        res.json( {success : false, info : null} )
        return
    }
    const response = await fetch(`${DB_URL}/products?id=${id}`)
    const result = await response.json()
    const success = (account === result[0]?.provider)
    const info = success? result[0]: null
    res.json( {success, info} )
})
// 儲存商品(編輯用)
app.post('/save_product', async (req, res) => {
    const {id, token, remain_imgs, imgs, name, description, price, amount, position} = req.body
    // 驗證身分
    const {account} = decodeToken(token)
    let response = await fetch(`${DB_URL}/products?id=${id}&provider=${account}`)
    let result = await response.json()
    if (!result[0]) {
        res.json( {success : false} )
        return
    }
    // 刪除不要的圖片
    (result[0]?.imgs || [])
        .filter(img => !remain_imgs.includes(img))
        .forEach(path => fs.unlink(path, () => {}))
    // 儲存新上傳的圖片
    let urls = []
    for (let i=0; i<imgs.length; i++) {
        const url = await saveImg(imgs[i], true)
        urls.push(url)
    }
    // 處理產品資訊
    const product = {
        imgs : remain_imgs.concat(urls),
        name, description, price, amount, position
    }
    // 丟到資料庫
    response = await fetch(`${DB_URL}/products/${id}`, {
        method : "PATCH",
        headers : { "Content-Type" : "application/json" },
        body : JSON.stringify(product)
    })
    res.json( {success : true} )
})

/* ======================================== */
// 取得我的商品
app.post('/my_products', async (req, res) => {
    const {token} = req.body
    // 驗證身分
    const {account} = decodeToken(token)
    let response = await fetch(`${DB_URL}/accounts?account=${account}`)
    let result = await response.json()
    if (!result[0]) {
        res.json( {success : false, avl_products : null, na_products : null} )
        return
    }
    // 取得商品
    response = await fetch(`${DB_URL}/products?provider=${account}&launched=true`)
    result = await response.json()
    const avl_products = [...result]
    response = await fetch(`${DB_URL}/products?provider=${account}&launched=false`)
    result = await response.json()
    const na_products = [...result]
    res.json({success : true, avl_products, na_products})
})
// 刪除我的商品
app.post('/delete_product', async (req, res) => {
    res.json({})
})
// 上架/下架我的商品
app.post('/launch_product', async (req, res) => {
    res.json({})
})

/* ======================================== */
server.listen(PORT, HOST, () => {
    console.log("\n===== Start =====")
    console.log(`at ${HOST}:${PORT}\n`)
})