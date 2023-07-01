/* ======================================== */
require('dotenv').config()
const express = require('express')
const cors = require('cors')
const jwt = require('jsonwebtoken')
const fetch = require('node-fetch')
const fs = require('fs')
const { v4: uuidv4 } = require('uuid')

/* ======================================== */
const JWT_SECRET = process.env.ACCESS_TOKEN_SECRET
const HOST = process.env.BackEnd_HOST
const PORT = process.env.BackEnd_PORT
const DB_URL = "http://127.0.0.1:5000"

const app = express()
app.use(cors())
app.use(express.json({limit: '50mb'}))
const server = require('http').Server(app)
const io = require('socket.io')(server, {cors: {origin: "*"}})

/* ======================================== *//* ======================================== */
let online = {}

/* 前端登入後會連接 socket */
io.on('connection', socket => {
    /* 此時可以從 headers 拿 token */
    const token = socket?.handshake?.headers?.authorization || null
    const {account} = decodeToken(token)
    /* 如果 token 解析錯誤，就離開函式 */
    if (!token || !account) return
    /* 加入線上列表 */
    if (!online[account]) online[account] = []
    online[account].push(socket.id)
    // console.log("已登入", online)
    
    /* 前端登出後或是關閉分頁，會產生 socket 斷線的事件 */
    socket.on("disconnect", () => {
        /* 從線上列表移除 */
        const index = online[account].indexOf(socket.id)
        if (index !== -1) online[account].splice(index, 1)
        if (!online[account][0]) delete online[account]
        // console.log("已登出", online)
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
    /* 產生 id */
    const uniqueId = uuidv4()
    // 儲存圖片到 img 資料夾
    const type = img.replace("data:image/","").split(";")[0]
    const path = `${__dirname}/img/${uniqueId}.${type}`
    const data = img.replace(/^data:image\/\w+;base64,/, "")
    const buf = Buffer.from(data, 'base64')
    if (doSave) fs.writeFile(path, buf, () => {})
    // 回傳子網址
    return Promise.resolve(`img/${uniqueId}.${type}`)
}
// 將token解密
function decodeToken(token) {
    try {
        return jwt.verify(token, JWT_SECRET)
    } catch {
        return {}
    }
}

/* ======================================== *//* ======================================== */
app.post("/api/signup", async (req, res) => {
    const {account} = req.body
    let response = await fetch(`${DB_URL}/accounts?account=${account}`)
    let result = await response.json()
    let success = false, message = ""
    if (result[0]) {
        success = false
        message = "帳號已經被註冊"
    } else {
        const payload = {...req.body, nickname: account, intro: ""}
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
app.post("/api/login", async (req, res) => {
    const {account, password} = req.body
    const response = await fetch(`${DB_URL}/accounts?account=${account}`)
    const result = await response.json()
    const success = (account === result[0]?.account) && (password === result[0]?.password)
    let message = ""
    if (!result[0]) message = "尚未註冊"
    else if (!success) message = "登入失敗"
    else message = jwt.sign({
        account : result[0]?.account || "",
        nickname : result[0]?.nickname || ""  
    }, JWT_SECRET)
    res.json( {success, message, account} )
})
app.get('/api/token_verify', async (req, res) => {
    const token = req.headers?.authorization || undefined
    const {account} = decodeToken(token)
    const success = account? true: false
    res.json( {success, account} )
})

/* ======================================== */
// 回傳聊天歷史紀錄
app.get('/chat_history', async (req, res) => {
    const receiver = req.query?.receiver || undefined
    const token = req.headers?.authorization || undefined
    // 驗證身分
    const {account} = decodeToken(token)
    const provider = account
    let response = await fetch(`${DB_URL}/accounts?account=${receiver}`)
    let result = await response.json()
    if (!result[0] || !provider || !receiver || provider === receiver) {
        res.json({success : false, history : null})
        return
    }
    // 取得聊天紀錄
    const query = `provider=${provider}&receiver=${receiver}&provider=${receiver}&receiver=${provider}`
    response = await fetch(`${DB_URL}/chat_history?${query}`)
    result = await response.json()
    res.json( {success : true, history : result} )
})
// 回傳所有帳號
app.get('/chat_list', async (req, res) => {
    const token = req.headers?.authorization || undefined
    // 驗證身分
    const {account} = decodeToken(token)
    let response = await fetch(`${DB_URL}/accounts?account=${account}`)
    let result = await response.json()
    if (!result[0]) {
        res.json({success : false, list : null})
        return
    }
    // 取得除了自己外的所有帳號
    response = await fetch(`${DB_URL}/accounts?account_ne=${account}`)
    result = await response.json()
    result = result.map( user => {
        return {account : user?.account}
    })
    res.json( {success : true, list : result} )
})
// 顯示圖片
app.get('/img/:name', async (req, res) => {
    const Picture = `${__dirname}/img/${req.params.name}`
    const NotFound = `${__dirname}/img/NotFound.jpeg`
    fs.readFile(Picture, (err) => {
        res.sendFile(err? NotFound: Picture)
    })
})

/* ======================================== */
// C 新增商品
app.post('/api/commodity/commodity_CRUD', async (req, res) => {
    const token = req.headers?.authorization || undefined
    const {launched, imgs, name, description, price, amount, position} = req.body
    // 驗證身分
    const {account} = decodeToken(token)
    const response = await fetch(`${DB_URL}/accounts?account=${account}`)
    const result = await response.json()
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
    await fetch(`${DB_URL}/products`, {
        method : "POST",
        headers : { "Content-Type" : "application/json" },
        body : JSON.stringify(product)
    })
    res.json( {success : true} )
})
// R 取得商品
app.get('/api/commodity/commodity_CRUD', async (req, res) => {
    const id = req.query?.id || undefined
    const token = req.headers?.authorization || undefined
    // 驗證身分
    const {account} = decodeToken(token)
    const response = await fetch(`${DB_URL}/products?id=${id}&provider=${account}`)
    const result = await response.json()
    if (!result[0]) {
        res.json( {success : false, info : null} )
        return
    }
    // 回傳
    res.json( {success : true, info : result[0]} )
})
// U 儲存商品
app.put('/api/commodity/commodity_CRUD', async (req, res) => {
    const id = req.query?.id || undefined
    const token = req.headers?.authorization || undefined
    const {remain_imgs, imgs, name, description, price, amount, position} = req.body
    // 驗證身分
    const {account} = decodeToken(token)
    const response = await fetch(`${DB_URL}/products?id=${id}&provider=${account}`)
    const result = await response.json()
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
    await fetch(`${DB_URL}/products/${id}`, {
        method : "PATCH",
        headers : { "Content-Type" : "application/json" },
        body : JSON.stringify(product)
    })
    res.json( {success : true} )
})
// D 刪除商品
app.delete('/api/commodity/commodity_CRUD', async (req, res) => {
    const id = req.query?.id || undefined
    const token = req.headers?.authorization || undefined
    // 驗證身分
    const {account} = decodeToken(token)
    let response = await fetch(`${DB_URL}/products?id=${id}&provider=${account}`)
    let result = await response.json()
    if (!result[0]) {
        res.json( {success : false} )
        return
    }
    // 刪除不要的圖片
    (result[0]?.imgs || []).forEach(path => fs.unlink(`${__dirname}/${path}`, () => {}))
    // 從資料庫刪除
    await fetch(`${DB_URL}/products/${id}`, {method : "DELETE"})
    res.json( {success : true} )
})
// 取得我的所有商品
app.get('/api/commodity/my_commodity', async (req, res) => {
    const token = req.headers?.authorization || undefined
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
// 上架/下架我的商品
app.put('/launch_product', async (req, res) => {
    const id = req.query?.id || undefined
    const token = req.headers?.authorization || undefined
    const {launched} = req.body
    // 驗證身分
    const {account} = decodeToken(token)
    const response = await fetch(`${DB_URL}/products?id=${id}&provider=${account}`)
    const result = await response.json()
    if (!result[0]) {
        res.json( {success : false} )
        return
    }
    // 更新資料庫的商品
    const product = {...result[0], launched}
    await fetch(`${DB_URL}/products/${id}`, {
        method : "PATCH",
        headers : { "Content-Type" : "application/json" },
        body : JSON.stringify(product)
    })
    res.json( {success : true} )
})

/* ======================================== */
// 查看賣場
app.get('/store', async (req, res) => {
    const seller = req.query?.seller || undefined
    // 確認賣場存在
    let response = await fetch(`${DB_URL}/accounts?account=${seller}`)
    let result = await response.json()
    if (!result[0]) {
        res.json( {success : false, provider : null, products : null} )
        return
    }
    //　取得賣家資訊
    const {phone, mail, nickname, intro} = result[0]
    const provider = {phone, mail, nickname, intro}
    //　取得賣場商品
    response = await fetch(`${DB_URL}/products?provider=${seller}&launched=true`)
    result = await response.json()
    res.json( {success : true, provider : provider, products : result} )
})
// 商品頁面
app.get('/product', async (req, res) => {
    const id = req.query?.id || undefined
    const response = await fetch(`${DB_URL}/products?id=${id}&launched=true`)
    const result = await response.json()
    const success = result[0]? true: false
    const product = result[0] || []
    res.json( {success, product} )
})
// 首頁給商品
app.get('/homepage', async (req, res) => {
    const response = await fetch(`${DB_URL}/products?launched=true`)
    const result = await response.json()
    res.json( {result} )
})
// 搜尋商品
app.get('/result', async (req, res) => {
    const {queryString} = req?.query || []
    const params = queryString
        .split(" ")
        .map(element => `&name_like=${element}`)
        .join("")
    const response = await fetch(`${DB_URL}/products?launched=true${params}`)
    const result = await response.json()
    res.json( {result} )
})

/* ======================================== *//* ======================================== */
// C 加入商品到購物清單 id為商品的id (注意:不能將自己的商品加入購物清單)
app.post('/cart/cart_CRUD', async (req, res) => {
    const id = req.query?.id || undefined
    const token = req.headers?.authorization || undefined
    // 驗證身分
    const {account} = decodeToken(token)
    // 商品是否存在
    const response = await fetch(`${DB_URL}/products/${id}`)
    const result = await response.json()
    if (!account || !result) {
        res.json( {success : false} )
        return
    }
    const {provider} = result
    // 加入一筆資料到購物車list
    const payload = {
        product_id : id,
        provider : provider,
        consumer : account
    }
    await fetch(`${DB_URL}/shopping_cart`, {
        method : "POST",
        headers : { "Content-Type" : "application/json" },
        body : JSON.stringify(payload)
    })
    res.json( {success : true} )
})
// R 讀取商品是否在購物清單 id為商品的id
app.get('/cart/cart_CRUD', async (req, res) => {
    const id = req.query?.id || undefined
    const token = req.headers?.authorization || undefined
    // 驗證身分
    const {account} = decodeToken(token)
    if (!account) {
        res.json( {success : false} )
        return
    }
    // 商品是否存在
    const response = await fetch(`${DB_URL}/shopping_cart?product_id=${id}&consumer=${account}`)
    const result = await response.json()
    res.json( {success : true, isAdded : result.length!==0} )
})
// D 從購物清單刪除商品 id為商品的id
app.del('/cart/cart_CRUD', async (req, res) => {
    const id = req.query?.id || undefined
    const token = req.headers?.authorization || undefined
    const {account} = decodeToken(token)
    // 查看是否存在並取得預設id
    const response = await fetch(`${DB_URL}/shopping_cart?product_id=${id}&consumer=${account}`)
    const result = await response.json()
    if (!result[0]) {
        res.json( {success : false} )
        return
    }
    await fetch(`${DB_URL}/shopping_cart/${result[0].id}`, {method : "DELETE"})
    res.json( {success : true} )
})

/* ======================================== */
// 取得購物車的所有商品
app.get('/cart/my_cart', async (req, res) => {
    const token = req.headers?.authorization || undefined
    // 驗證身分
    const {account} = decodeToken(token)
    if (!account) {
        res.json( {success : false} )
        return
    }
    // 取得帳號的購物清單
    let response = await fetch(`${DB_URL}/shopping_cart?consumer=${account}`)
    let result = await response.json()
    // 取得這些商品名稱
    let params = result.map(element => element.product_id).join("&id=")
    response = await fetch(`${DB_URL}/products?id=${params}&launched=true&_sort=provider`)
    result = await response.json()
    // 準備回傳的資料
    const data = {}
    result.forEach(element => {
        const {provider, name, imgs} = element
        if (!data[provider]) data[provider] = {cover : null, items : []}
        data[provider].cover = imgs[0]
        data[provider].items.push(name)
    })
    // 用賣家帳號取得暱稱
    params = Object.keys(data).join("&account=")
    response = await fetch(`${DB_URL}/accounts?account=${params}`)
    result = await response.json()
    // 回傳資料加入暱稱
    result.forEach(element => {
        const {account, nickname} = element
        data[account] = {
            nickname : nickname,
            ...data[account]
        }
    })
    res.json( {success : true, result: data} )
})
// 取得購物車在特定賣場的商品
app.get('/cart/my_storecart', async (req, res) => {
    const seller = req.query?.seller || undefined
    const token = req.headers?.authorization || undefined
    // 驗證身分
    const {account} = decodeToken(token)
    if (!account) {
        res.json( {success : false} )
        return
    }
    // 取得帳號在特定賣場的購物清單
    let response = await fetch(`${DB_URL}/shopping_cart?consumer=${account}&provider=${seller}`)
    let result = await response.json()
    // 取得商品資訊
    const params = result.map(element => element.product_id).join("&id=")
    response = await fetch(`${DB_URL}/products?id=${params}&launched=true`)
    result = await response.json()
    // 修改商品資訊
    const data = []
    result.forEach(element => {
        const {id, name, imgs, price, amount} = element
        const payload = {id, name, cover:imgs[0], price, amount}
        data.push(payload) 
    })
    res.json( {success : true, result : data} )
})

/* ======================================== *//* ======================================== */
server.listen(PORT, HOST, () => {
    console.log("\n===== Start =====")
    console.log(`at ${HOST}:${PORT}\n`)
})
