/* ======================================== */
require('dotenv').config()
const express = require('express')
const cors = require('cors')
const jwt = require('jsonwebtoken')
const fetch = require('node-fetch')
const fs = require('fs')
const { v4: uuidv4 } = require('uuid')

/* ======================================== */
const JWT_SECRET = "80b340492b2ad963fa08bb80c9a8969882f05fa4e1d0fbd07fec2c3cc808da1d8deb991dd873905d278fc2902cb218a7b4210a0f743171fbe2abb1157e6da5be"
const HOST = "192.168.244.130"
const PORT = "4000"
const DB_URL = "http://127.0.0.1:5000"

const app = express()
app.use(cors())
app.use(express.json({limit: '100mb'}))
const server = require('http').Server(app)
const io = require('socket.io')(server, {
    cors: { origin: "*" },
    maxHttpBufferSize: 10e7 //10MB
})

/* ======================================== *//* ======================================== */
let online = {}

/* 前端登入後會連接 socket */
io.on('connection', socket => {
    /* 此時可以從 headers 拿 token */
    const token = socket?.handshake?.headers?.authorization || null
    const {account, nickname} = decodeToken(token)
    /* 如果 token 解析錯誤，就離開函式 */
    if (!token || !account) return
    /* 加入線上列表 */
    if (!online[account]) online[account] = []
    online[account].push(socket.id)
    
    /* 前端登出後或是關閉分頁，會產生 socket 斷線的事件 */
    socket.on("disconnect", () => {
        /* 從線上列表移除 */
        const index = online[account].indexOf(socket.id)
        if (index !== -1) online[account].splice(index, 1)
        if (!online[account][0]) delete online[account]
    })

    /* 傳送訊息 */
    socket.on("message", async ({receiver, type, content}) => {
        // 驗證對方是否存在
        const response = await fetch(`${DB_URL}/accounts?account=${receiver}`)
        const result = await response.json()
        // 不能傳訊息給自己
        if (!result[0] || account === receiver) return
        // 處理訊息
        const datetime = getCurrentDateTime()
        const data = (type === "img")? await saveImg(content, true): content
        const message = {
            provider : account,
            receiver,
            type,
            content : data,
            datetime,
            read : false,
        }
        // 丟到資料庫
        await fetch(`${DB_URL}/chat_history`, {
            method : "POST",
            headers : { "Content-Type" : "application/json" },
            body : JSON.stringify(message)
        })
        // 傳給自己
        sendSocketMessage(account, "message", {...message, nickname})
        // 傳給對方
        sendSocketMessage(receiver, "message", {...message, nickname})
    })
})

// 根據帳號送出訊息
function sendSocketMessage(account, event, payload) {
    if (!online[account]) return
    online[account]
        .forEach(socketId => {
            const socket = io.sockets.sockets.get(socketId)
            socket.emit(event, payload)
        })
}

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
//取得現在日期時間
function getCurrentDateTime() {
    const current = new Date().toLocaleString('zh-TW', {
        timeZone: 'Asia/Taipei', hourCycle: 'h23',
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
    })
    const [date, time] = current.split(" ")
    return [date.split("/").join("-"), time].join("T")
}

/* ======================================== *//* ======================================== */
app.post("/api/userfile/signup/", async (req, res) => {
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
app.post("/api/userfile/login/", async (req, res) => {
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
app.get('/api/userfile/verify_token/', async (req, res) => {
    const token = req.headers?.authorization || undefined
    const {account} = decodeToken(token)
    const success = account? true: false
    res.json( {success, account} )
})

/* ======================================== */
// 回傳有聊天過的對象以及最後的對話內容 (照時間排，最新的在前面)
app.get('/api/chat/overview/', async (req, res) => {
    // 驗證身分
    const token = req.headers?.authorization || undefined
    const {account} = decodeToken(token)
    if (!account) {
        res.json({success : false})
        return
    }
    const response = await fetch(`${DB_URL}/chat_history?provider=${account}`)
    const result = await response.json()
    const response2 = await fetch(`${DB_URL}/chat_history?receiver=${account}`)
    const result2 = await response2.json()
    const history = result.concat(result2)
    history.sort((a, b) => a.id - b.id)
    // 拿最後一則訊息
    const lastMessage = {}
    history
        .forEach(element => {
            const {provider, receiver, type, content, datetime, id} = element
            const user = (provider === account)? receiver: provider
            const string = (type === "img")? "傳送了一張圖片": content
            lastMessage[user] =  {account: user, content: string, datetime, id}
        })
    for (let i=0; i<Object.keys(lastMessage).length; i++) {
        const user = Object.keys(lastMessage)[i]
        const response = await fetch(`${DB_URL}/accounts/?account=${user}`)
        const result = await response.json()
        const {nickname} = result[0]
        lastMessage[user] = {...lastMessage[user], nickname}
    }
    const newArray = Object.keys(lastMessage)
        .map(key => lastMessage[key])
        .sort((a, b) => b.id - a.id)
    // 計算未讀聊天數量
    for (let i=0; i<newArray.length; i++) {
        const response = await fetch(`${DB_URL}/chat_history?provider=${newArray[i].account}`)
        const result = await response.json()
        const number = result.filter(element => !element.read).length
        newArray[i] = {...newArray[i], number}
    }
    res.json({success : true, list : newArray})
})
// 回傳聊天歷史紀錄 receiver為對方的帳號
app.get('/api/chat/history/', async (req, res) => {
    const receiver = req.query?.receiver || undefined
    // 驗證身分
    const token = req.headers?.authorization || undefined
    const {account} = decodeToken(token)
    const response = await fetch(`${DB_URL}/accounts?account=${receiver}`)
    const result = await response.json()
    if (!result[0] || !account || account === receiver) {
        res.json({success : false, history : []})
        return
    }
    // 取得聊天紀錄
    const nickname = result[0].nickname 
    const params = `provider=${account}&receiver=${receiver}&provider=${receiver}&receiver=${account}`
    const response2 = await fetch(`${DB_URL}/chat_history?${params}`)
    const result2 = await response2.json()
    // 標記已讀
    const read_list = result2.filter(element => element.receiver===account && element.read===false)
    for (let i=0; i<read_list.length; i++) {
        await fetch(`${DB_URL}/chat_history/${read_list[i].id}`, {
            method : "PATCH",
            headers : { "Content-Type" : "application/json" },
            body : JSON.stringify({...read_list[i], read : true})
        })
    }
    res.json( {success : true, history : result2, nickname : nickname} )
})
// 回傳全部未讀訊息數量
app.get('/api/chat/notify/', async (req, res) => {
    const token = req.headers?.authorization || undefined
    // 驗證身分
    const {account} = decodeToken(token)
    const response = await fetch(`${DB_URL}/chat_history?receiver=${account}&read=false`)
    const result = await response.json()
    res.json( {success : true, number : result.length} )
})
// 標示對某人訊息已讀 receiver為對方的帳號
app.put('/api/chat/notify/', async (req, res) => {
    const {receiver} = req.query
    const token = req.headers?.authorization || undefined
    // 驗證身分
    const {account} = decodeToken(token)
    // 找對某人的未讀聊天
    const response = await fetch(`${DB_URL}/chat_history?provider=${receiver}&consumer=${account}&read=false`)
    const result = await response.json()
    const ids = result.map(element => element.id)
    // 標記已讀
    for (let i=0; i<ids.length; i++) {
        await fetch(`${DB_URL}/chat_history/${ids[i]}`, {
            method : "PATCH",
            headers : { "Content-Type" : "application/json" },
            body : JSON.stringify({read : true})
        })
    }
    res.json( {success : true} )
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
app.post('/api/commodity/commodity_CRUD/', async (req, res) => {
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
        provider : account,
        imgs : urls,
        name,
        description,
        price : Number(price),
        amount : Number(amount),
        BorrowedAmount : Number(0),
        position,
        launched
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
app.get('/api/commodity/commodity_CRUD/', async (req, res) => {
    const id = req.query?.id || undefined
    const token = req.headers?.authorization || undefined
    // 驗證身分
    const {account} = decodeToken(token)
    const response = await fetch(`${DB_URL}/products?id=${id}&provider=${account}`)
    const result = await response.json()
    if (!result[0]) {
        res.json( {success : false, data : null} )
        return
    }
    // 回傳
    res.json( {success : true, data : result[0]} )
})
// U 儲存商品
app.put('/api/commodity/commodity_CRUD/', async (req, res) => {
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
        name,
        description,
        price : Number(price),
        amount : Number(amount),
        position
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
app.delete('/api/commodity/commodity_CRUD/', async (req, res) => {
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
app.get('/api/commodity/my_commodity/', async (req, res) => {
    const token = req.headers?.authorization || undefined
    // 驗證身分
    const {account} = decodeToken(token)
    let response = await fetch(`${DB_URL}/accounts?account=${account}`)
    let result = await response.json()
    if (!result[0]) {
        res.json( {success : false, launched : null, unlaunched : null} )
        return
    }
    // 取得商品
    response = await fetch(`${DB_URL}/products?provider=${account}&launched=true`)
    result = await response.json()
    const launched = [...result]
    response = await fetch(`${DB_URL}/products?provider=${account}&launched=false`)
    result = await response.json()
    const unlaunched = [...result]
    res.json({success : true, launched, unlaunched})
})
// 上架/下架我的商品
app.post('/api/commodity/launch/', async (req, res) => {
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
app.get('/api/userfile/browse_store/', async (req, res) => {
    const seller = req.query?.account || undefined
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
    res.json( {success : true, provider : provider, commodity : result} )
})
// 商品頁面
app.get('/api/commodity/get_commodity/', async (req, res) => {
    const id = req.query?.id || undefined
    const response = await fetch(`${DB_URL}/products?id=${id}&launched=true`)
    const result = await response.json()
    const success = result[0]? true: false
    const product = result[0] || []
    res.json( {success, commodity : product} )
})
// 首頁給商品
app.get('/api/commodity/get_launched_commodity/', async (req, res) => {
    const response = await fetch(`${DB_URL}/products?launched=true`)
    const result = await response.json()
    res.json(result)
})
// 搜尋商品
app.get('/api/commodity/get_searched_commodity/', async (req, res) => {
    const {keyword} = req?.query || []
    const params = keyword
        .split(" ")
        .map(element => `&name_like=${element}`)
        .join("")
    const response = await fetch(`${DB_URL}/products?launched=true${params}`)
    const result = await response.json()
    res.json(result)
})

/* ======================================== *//* ======================================== */
// C 加入商品到購物清單 id為商品的id (注意:不能將自己的商品加入購物清單)
app.post('/api/cart/cart_CRUD/', async (req, res) => {
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
app.get('/api/cart/cart_CRUD/', async (req, res) => {
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
app.del('/api/cart/cart_CRUD/', async (req, res) => {
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
app.get('/api/cart/my_cart/', async (req, res) => {
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
        if (!data[provider]) data[provider] = {cover : imgs[0], items : []}
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
app.get('/api/cart/my_storecart/', async (req, res) => {
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

/* ======================================== */
// 取得數個訂單/購買清單 progress為訂單的進度，status為provider(賣家)或是consumer(買家)
app.get('/api/order/overview/', async (req, res) => {
    const status = req.query?.status || undefined
    const progress = req.query?.progress || undefined
    const token = req.headers?.authorization || undefined
    const {account} = decodeToken(token)
    if (!account) {
        res.json( {success : false} )
        return
    }
    const response = await fetch(`${DB_URL}/order?progress=${progress}&${status}=${account}`)
    const result = await response.json()
    const orders = result
        .map(element => {
            const {order_id, consumer, provider, order, totalprice} = element
            const cover = order[0].cover || "img/NotFound"
            const items = order.map(item => item.name)
            const nickname = account===provider? consumer: provider
            return {
                order_id, nickname, cover, totalprice, items
            }
        })
    for (let i=0; i<orders.length; i++) {
        const response = await fetch(`${DB_URL}/accounts?account=${orders[i].nickname}`)
        const result = await response.json()
        orders[i] = {
            ...orders[i],
            nickname : result[0].nickname
        }
    }
    res.json( {success : true, orders : orders} )
})
// C 下訂單
app.post('/api/order/order_CRUD/', async (req, res) => {
    const {options, comment, order} = req.body
    // 驗證帳號
    const token = req.headers?.authorization || undefined
    const {account} = decodeToken(token)
    if (!account) {
        res.json( {success : false} )
        return
    }
    // 取得資料庫的商品
    const params = Object.keys(order).join("&id=")
    const response = await fetch(`${DB_URL}/products?id=${params}&launched=true`)
    const result = await response.json()
    // 用來紀錄商品數量 (json)
    const newProductInfo = {}
    // 計算總金額並記錄數量
    let totalPrice = 0
    let success = (Object.keys(order).length === result.length)
    result
        .forEach(product => {
            if (!success) return
            if (order[product.id]) {
                const {amount, price} = order[product.id]
                if (product.price !== price) success = false
                else if (product.amount < amount) success = false
                else {
                    totalPrice += Number(amount) * Number(price)
                    newProductInfo[product.id] = {
                        amount : Number(product.amount) - Number(amount),
                        BorrowedAmount : Number(product.BorrowedAmount) + Number(amount)
                    }
                }
            }
        })
    if (!success) {
        res.json({success : false})
        return 
    }
    // 將數量存回資料庫同時清空購物車
    for (let i=0; i<Object.keys(newProductInfo).length; i++) {
        const id = Object.keys(newProductInfo)[i]
        //更改商品數量
        await fetch(`${DB_URL}/products/${id}`, {
            method : "PATCH",
            headers : { "Content-Type" : "application/json" },
            body : JSON.stringify(newProductInfo[id])
        })
        //從購物車刪掉
        const response = await fetch(`${DB_URL}/shopping_cart?product_id=${id}&consumer=${account}`)
        const result = await response.json()
        if (result[0].length !== 0) await fetch(`${DB_URL}/shopping_cart/${result[0].id}`, {method : "DELETE"})
    }
    // 留下需要的商品資料
    let provider = null
    const products = result
        .map(product => {
            provider = product.provider
            return {
                id: product.id,
                name: product.name,
                cover: product.imgs[0],
                price: product.price,
                amount: order[product.id].amount,
            }
        })
    // 紀錄訂單
    const order_id = uuidv4()
    const payload = {
        order_id : order_id, //自己定義的訂單編號
        consumer : account, //買家
        provider : provider, //賣家
        read_consumer: false,
        read_provider: false,
        lasttime: Date.now(),
        order : products, //商品數量價格等資訊
        totalprice : totalPrice, //總金額
        comment, //買家留言
        options, //買家提供的時間地點選項
        selectedOption : {start : "", end : "", position : ""}, //賣家選擇的時間和地點
        usingMessage : false, //賣家是否選擇只使用訊息決定時間地點
        actual : {start : "", end : ""}, //實際租借時間
        progress : 0 //訂單進度 0待確認 1待收貨 2待歸還 3已完成 -1未完成
    }
    await fetch(`${DB_URL}/order`, {
        method : "POST",
        headers : { "Content-Type" : "application/json" },
        body : JSON.stringify(payload)
    })
    res.json({success : true})
    // 發送及時通知 給買家
    sendSocketMessage(account, "order", {id: order_id, message: "已提交租借申請"})
    // 發送及時通知 給賣家
    sendSocketMessage(provider, "order", {id: order_id, message: "您有一筆新訂單"})
})
// R 透過訂單id(自定義的) 取得訂單資訊
app.get('/api/order/order_CRUD/', async (req, res) => {
    const id = req.query?.id || undefined
    const token = req.headers?.authorization || undefined
    const {account} = decodeToken(token)
    // 驗證帳號
    if (!account) {
        res.json( {success : false} )
        return
    }
    const response = await fetch(`${DB_URL}/order?order_id=${id}`)
    const result = await response.json()
    // 訂單是否存在
    if (!result[0]) {
        res.json( {success : false} )
        return
    }
    // 身分是否符合
    const {provider, consumer} = result[0]
    if (account !== provider && account !== consumer) {
        res.json( {success : false} )
        return
    }
    // 取得暱稱
    const response2 = await fetch(`${DB_URL}/accounts?account=${provider}`)
    const result2 = await response2.json()
    const response3 = await fetch(`${DB_URL}/accounts?account=${consumer}`)
    const result3 = await response3.json()
    // 修改回傳資料
    const {progress, order, totalprice, comment, options, usingMessage, selectedOption, actual} = result[0]
    const payload = {
        provider : {
            account : result[0].provider,
            nickname : result2[0].nickname,
            mail : result2[0].mail,
            phone : result2[0].phone
        },
        consumer : {
            account : result[0].consumer,
            nickname : result3[0].nickname,
            mail : result3[0].mail,
            phone : result3[0].phone
        },
        progress, order, totalprice, comment, options, usingMessage, selectedOption, actual
    }
    res.json( {success : true, order : payload} )
})
// U 透過訂單id(自定義的) 更新訂單狀態，mode為操作模式 1確認 2取消 3已收貨 4已歸還
app.put('/api/order/order_CRUD/', async (req, res) => {
    const {usingMessage, selectedOption} = req.body
    const order_id = req.query?.id || undefined
    const mode = Number(req.query?.mode) || -1
    const token = req.headers?.authorization || undefined
    const {account} = decodeToken(token)
    // 驗證帳號
    if (!account) {
        res.json( {success : false} )
        return
    }
    const response = await fetch(`${DB_URL}/order?order_id=${order_id}`)
    const result = await response.json()
    // 訂單是否存在
    if (!result[0]) {
        res.json( {success : false} )
        return
    }
    // 檢查操作與對應身分是否符合(可參考文件)，並處理要更新的訂單資訊
    let payload = {
        read_consumer: false,
        read_provider: false,
        lasttime: Date.now(),
    }
    let isAccessable = false
    const {id, provider, consumer, order, actual, progress} = result[0]
    switch (mode) {
        case 1: { //確認訂單
            isAccessable = (progress===0) || (account===provider)
            if (!isAccessable) break
            payload = {
                ...payload,
                usingMessage,
                selectedOption,
                progress : 1
            }
            break
        }
        case 2: { //取消訂單
            isAccessable = (progress===0||progress===1) && (account===provider||account===consumer)
            if (!isAccessable) break
            payload = {...payload, progress : -1}
            break
        }
        case 3: { //已收貨
            isAccessable = (progress===1) && (account===consumer)
            if (!isAccessable) break
            payload = {
                ...payload,
                actual : {
                    ...actual,
                    start : getCurrentDateTime()
                },
                progress : 2
            }
            break
        }
        case 4: { //已歸還
            isAccessable = (progress===2) && (account===provider)
            if (!isAccessable) break
            payload = {
                ...payload,
                actual : {
                    ...actual,
                    end : getCurrentDateTime()
                },
                progress : 3
            }
            break
        }
    }
    // 請求不正當
    if (!isAccessable) {
        res.json( {success : false} )
        return
    }
    // 歸還商品
    if (mode === 2 || mode === 4) {
        const newProductInfo = {} // 用來紀錄商品數量 (json)
        for (let i=0; i<order.length; i++) {
            const response = await fetch(`${DB_URL}/products/${order[i].id}`)
            const result = await response.json()
            const {BorrowedAmount, amount} = result
            newProductInfo[order[i].id] = {
                amount : Number(amount) + Number(order[i].amount),
                BorrowedAmount : Number(BorrowedAmount) - Number(order[i].amount)
            }
        }
        for (let i=0; i<Object.keys(newProductInfo).length; i++) {
            const id = Object.keys(newProductInfo)[i]
            //更改商品數量
            await fetch(`${DB_URL}/products/${id}`, {
                method : "PATCH",
                headers : { "Content-Type" : "application/json" },
                body : JSON.stringify(newProductInfo[id])
            })
        }
    }
    // 更新資料庫
    await fetch(`${DB_URL}/order/${id}`, {
        method : "PATCH",
        headers : { "Content-Type" : "application/json" },
        body : JSON.stringify(payload)
    })
    res.json( {success : true} )
    // 發送及時通知 給買家
    sendSocketMessage(consumer, "order", {id: order_id, message: "訂單狀態已更新"})
    // 發送及時通知 給賣家
    sendSocketMessage(provider, "order", {id: order_id, message: "訂單狀態已更新"})
})

/* ======================================== */
// R 取得訂單更新通知
app.get('/api/order/notify/', async (req, res) => {
    const token = req.headers?.authorization || undefined
    const {account} = decodeToken(token)
    const response = await fetch(`${DB_URL}/order?consumer=${account}&_sort=lasttime`)
    const result = await response.json()
    const consumer_orderlist = result
        .map(element => {
            return {
                order_id: element.order_id,
                cover: element.order[0].cover,
                progress: element.progress,
                read: element.read_consumer
            }
        })
    const response2 = await fetch(`${DB_URL}/order?provider=${account}&_sort=lasttime`)
    const result2 = await response2.json()
    const provider_orderlist = result2
        .map(element => {
            return {
                order_id: element.order_id,
                cover: element.order[0].cover,
                progress: element.progress,
                read: element.read_provider
            }
        })
    res.json({success : true, consumer_orderlist, provider_orderlist})
})
// U 透過訂單id(自定義的) 標示通知已讀，all=true 表示全部已讀
app.put('/api/order/notify/', async (req, res) => {
    const {id, all} = req.query
    const token = req.headers?.authorization || undefined
    const {account} = decodeToken(token)
    if (!all) {
        const response = await fetch(`${DB_URL}/order?order_id=${id}`)
        const result = await response.json()
        let payload = {}
        if (!result[0]) {
            res.json({success : false})
            return
        } else if (result[0].consumer === account) {
            payload = {read_consumer : true}
        } else if (result[0].provider === account) {
            payload = {read_provider : true}
        } else {
            res.json({success : false})
            return
        }
        await fetch(`${DB_URL}/order/${result[0].id}`, {
            method : "PATCH",
            headers : { "Content-Type" : "application/json" },
            body : JSON.stringify(payload)
        })
    } else {
        const response = await fetch(`${DB_URL}/order?consumer=${account}`)
        const result = await response.json()
        const response2 = await fetch(`${DB_URL}/order?provider=${account}`)
        const result2 = await response2.json()
        const ids = result.map(element => element.id)
        const ids2 = result2.map(element => element.id)
        for (let i=0; i<ids.length; i++) {
            await fetch(`${DB_URL}/order/${ids[i]}`, {
                method : "PATCH",
                headers : { "Content-Type" : "application/json" },
                body : JSON.stringify({read_consumer : true})
            })
        }
        for (let i=0; i<ids2.length; i++) {
            await fetch(`${DB_URL}/order/${ids2[i]}`, {
                method : "PATCH",
                headers : { "Content-Type" : "application/json" },
                body : JSON.stringify({read_provider : true})
            })
        }
    }
    res.json({success : true})
})

/* ======================================== *//* ======================================== */
// 拿個人資料
app.get('/api/userfile/profile/', async (req, res) => {
    const token = req.headers?.authorization || undefined
    const {account} = decodeToken(token)
    // 驗證帳號
    if (!account) {
        res.json( {success : false} )
        return
    }
    const response = await fetch(`${DB_URL}/accounts?account=${account}`)
    const result = await response.json()
    if (!result[0]) {
        res.json( {success : false} )
        return
    }
    const profile = {
        account : result[0].account,
        nickname : result[0].nickname,
        phone : result[0].phone,
        mail : result[0].mail,
        intro : result[0].intro
    }
    res.json({success : true, data : profile})
})
// 修改個人資料
app.put('/api/userfile/profile/', async (req, res) => {
    const payload = req.body
    const token = req.headers?.authorization || undefined
    const {account} = decodeToken(token)
    // 驗證帳號
    const response = await fetch(`${DB_URL}/accounts?account=${account}`)
    const result = await response.json()
    if (!result[0]) {
        res.json( {success : false} )
        return
    }
    // 驗證payload
    let isLegal = true
    Object.keys(payload)
        .forEach(key => {
            if (!isLegal) return
            if (!Object.keys(result[0]).includes(key)) isLegal = false
        })
    if (!isLegal) {
        res.json( {success : false} )
        return
    }
    await fetch(`${DB_URL}/accounts/${result[0].id}`, {
        method : "PATCH",
        headers : {"Content-Type" : "application/json"},
        body : JSON.stringify(payload)
    })
    res.json({success : true})
})
// 修改密碼
app.post('/api/userfile/password_change/', async (req, res) => {
    const {oldPassword, newPassword} = req.body
    const token = req.headers?.authorization || undefined
    const {account} = decodeToken(token)
    // 驗證帳號
    const response = await fetch(`${DB_URL}/accounts?account=${account}`)
    const result = await response.json()
    if (!result[0]) {
        res.json( {success : false} )
        return
    }
    const {password, id} = result[0]
    if (password !== oldPassword) {
        res.json({success : false, message : "密碼錯誤"})
        return
    }
    await fetch(`${DB_URL}/accounts/${id}`, {
        method : "PATCH",
        headers : {"Content-Type" : "application/json"},
        body : JSON.stringify({password : newPassword})
    })
    res.json({success : true, message : "更改成功"})
})

/* ======================================== *//* ======================================== */
server.listen(PORT, HOST, () => {
    console.log("\n===== Start =====")
    console.log(`at ${HOST}:${PORT}\n`)
})
