# .env
```js
REACT_APP_API_URL = "Backend URL"
REACT_APP_WS_URL = "Backend Websocket URL"
REACT_APP_MAPBOX_TOKEN = "Mapbox Token"
```

# API 文件
### 更新
#### (2023-09-02)
- 新增 `/api/chat/notify/`
- 新增 `/api/order/notify/`
- 修改 `/api/chat/overview/`
    - 回傳要加上未讀訊息數量
- 修改 `/api/chat/history/`
    - 要標記訊息已讀
- 修改 `/api/order/order_CRUD/`
    - 資料庫要多開雙方的已讀欄位
    - 訂單 process 更新時要重置已讀
- 修改 `socket.on("message", payload)`
    - 資料庫要多開已讀欄位

#### (2023-09-10)
- 將 Socket.IO 改為 WebSocket

## 購物車
### `/api/cart/cart_CRUD/`
<details>

- 用途
    - 查看商品是否在購物車
    - 加入商品到購物車
    - 從購物車移除商品
- params
    - `?id=`
        - 需要加上商品的 id
    - headers
        ```JavaScript
        {
            authorization : token //JWT token
        }
        ```
- method
    - `get`
        - response
        ```JavaScript
        {
            success : true or false, //是否成功
            isAdded : true or false  //此商品是否在購物車
        }
        ```
    - `post`
        - body
        ```JavaScript
        {

        }
        ```
        - response
        ```JavaScript
        {
            success : true or false //是否加入成功
        }
        ```
    - `delete`
        - response
        ```JavaScript
        {
            success : true or false //是否移除成功
        }
        ```

</details>

### `/api/cart/my_cart/`
<details>

- 用途
    - 取得購物車的商品
    - 以賣場為單位
    - 需要回傳賣家的暱稱
    - 各賣場需要一張封面 (第1個商品圖)
    - 各賣場的所有商品 (或者前4個)
    ![](https://drive.google.com/u/0/uc?id=1fGncZLktbonNdtgQrcNE7gh8pzW1YRyG&export=download)
- params
    - headers
        ```JavaScript
        {
            authorization : token //JWT token
        }
        ```
- method
    - `get`
        - response
        ```JavaScript
        {
            success : true or false, //是否獲取成功
            result: {
                "賣場1的帳號" : {
                    nickname : 暱稱,
                    cover : 封面1張(商品1的第1張圖),
                    items : [
                        "商品1名稱",
                        "商品2名稱",
                        "商品3名稱",
                        "商品5名稱"
                    ]
                },
                "賣場2的帳號" : {
                    nickname : 暱稱,
                    cover : 封面1張(商品101的第1張圖),
                    items : [
                        "商品101名稱",
                        "商品202名稱"
                    ]
                }
            }
        }
        ```
</details>

### `/api/cart/my_storecart/`
<details>

- 用途
    - 取得購物車在特定賣場的商品
    - 剩餘數量為 0 也要回傳
    - 未上架商品不行回傳
    - ![](https://drive.google.com/u/0/uc?id=1QG-9rhzBx4tiZiVfnQNIg2M5flUkgsLt&export=download)
- params
    - `?seller=`
        - 需要加上賣家的帳號
    - headers
    ```JavaScript
    {
        authorization : token //JWT token
    }
    ```
- method
    - `get`
        - response
    ```JavaScript
    {
        success: true or false, //帳號是否驗證成功
        result: [ //陣列形式給出購物清單，沒有商品就空陣列
            {
                id: 6, //商品 id
                name: 'Bang Dream', //名稱
                cover: 'img/5230f17c-2a52-4830-9c0f-19c471f70fa4.png', //封面圖片一張
                price: 5000, //金額
                amount: 1 //剩餘數量
            },
            {
                id: 11,
                name: 'Elden Ring',
                cover: 'img/5230f17c-2a52-4830-9c0f-19c471f70fa3.png',
                price: 1290,
                amount: 0
            }
        ]
    }
    ```
</details>

## 訂單
### `/api/order/order_CRUD/`
<details>

- 用途
    - 下訂單用
    - ![](https://drive.google.com/u/0/uc?id=1c_L22dvQOX7ZULwQcVzl7Jj8bAcyakmE&export=download)
    - 取得單筆訂單資料
    - ![](https://drive.google.com/u/0/uc?id=1ILrGnFpMh6s7qO8vX3ANBc7BxoeqF5gc&export=download)
    - ![](https://drive.google.com/u/0/uc?id=1Wl-Ito0QOaIGnbhaJJf59CrpgguKyRUr&export=download)
    
- params
    - headers
        ```JavaScript
        {
            authorization : token //JWT token
        }
        ```
    - `?id=`
        - for `get` `put`
        - 讀取和更新訂單要加上自定義的訂單 id
        
    - `?mode=`
        - for `put`
        - 更新訂單時所對應的操作
        - 1: 確認訂單
        - 2: 取消訂單
        - 3: 已收貨
        - 4: 已歸還
    - progress
        - 非參數，回傳資料用
        - 定義訂單進度
        - 不同身分在不同 progress 能做的操作不一樣
        -  0: 待確認
            - 買家: 取消訂單
            - 賣家: 取消訂單 確認訂單
        -  1: 待交貨
            - 買家: 取消訂單 已收貨
            - 賣家: 取消訂單
        -  2: 待歸還
            - 賣家: 已歸還
        -  3: 已完成
        - -1: 未完成
    - DateTime 日期時間表示
        - YYYY-MM-DDThh:mm (ex. 2018-06-07T00:00)
        - hh 範圍為 00~23
            - 午夜12點為00:00
            - 中午12點為12:00
- method
    - `post`
        - body
        ```JavaScript
        {
            options: { //買家提供的時段
                start: [ '2023-07-07T12:00', '2023-07-08T10:00' ],
                end: [ '2023-07-14T12:00', '2023-07-14T13:00' ],
                position: [
                    {
                        center: [ // 經緯度
                            121.54114515457269,
                            25.01396180464505
                        ],
                        name: "國立臺灣科技大學圖書館 大門口"
                    },
                    {
                        center: [
                            121.542203,
                            25.012472
                        ],
                        name: "台灣科技大學學生宿舍3舍"
                    }
                ]
            },
            comment: '你好', //買家留言
            order: { //訂單本體
                '商品id': { amount: 數量, price: 單項金額 },
                '1': { amount: 5, price: 1000 },
                '2': { amount: 2, price: 500 },
                '7': { amount: 1, price: 1290 }
            }
        }
        ```
        - response
        ```JavaScript
        {
            success : true or false //訂單是否成功
        }
        ```
        - 要存到資料庫的 (參考用)
        ```JavaScript
        const payload = {
            order_id : order_id, //自己定義的訂單編號
            consumer : account, //買家
            provider : provider, //賣家
            read_consumer: false, // 買家是否已讀訂單通知
            read_provider: false, // 賣家是否已讀訂單通知
            lasttime: Date.now(), // 紀錄更改日期用
            order : products, //商品數量價格等資訊
            totalprice : totalPrice, //總金額/天
            comment, //買家留言
            options, //買家提供的時間地點選項
            selectedOption : { //賣家選擇的時間和地點
                start : "",
                end : "",
                position : {
                    center: [0, 0], // 經緯度
                    name: "" //地點名稱
                }
            },
            usingMessage : false, //只用訊息決定時間和地點
            actual : { //實際租借時間
                start : "",
                end : ""
            },
            progress : 0 //上方定義有說明
        }
        ```
        - 提醒
            - 比對每項商品金額，若與前端傳的不一樣要回傳失敗
            - 商品剩餘數量不足要回傳失敗
            - 總金額要在後端計算
            - 記得更新資料庫的商品剩餘數量與借出數量
    - `get`
        - response
        ```JavaScript
        {
            success : true or false,
            order : {
                provider: { //賣家資訊
                    account: 'kokoro123',
                    nickname: '弦巻こころ',
                    mail: 'kokoro123@gmail.com',
                    phone: '0911222333'
                },
                consumer: { //買家資訊
                    account: 'hhh123', 
                    nickname: '鱷魚', 
                    mail: 'hhh123@gmail.com', 
                    phone: '09xxxxxxxx' 
                },
                progress: 3, //訂單進度
                order: [ //訂單本體
                    {
                        id: 2,
                        name: '承太郎',
                        cover: 'img/xxx.img',
                        price: 500,
                        amount: 5
                    },
                    {
                        id: 7,
                        name: 'Elden Ring',
                        cover: 'img/xxx.img',
                        price: 1290,
                        amount: 1
                    }
                ],
                totalprice: 3790, //總金額/天
                comment: '你好', //買家留言
                options: { //買家提供的選項
                    start: [ '2023-07-07T02:59' ],
                    end: [ '2023-07-14T02:01' ],
                    position: [
                        {
                            center: [ // 經緯度
                                121.54114515457269,
                                25.01396180464505
                            ],
                            name: '國立臺灣科技大學圖書館 大門口'
                        },
                        {
                            center: [
                                121.542203,
                                25.012472
                            ],
                            name: '台灣科技大學學生宿舍3舍'
                        }
                    ]
                },
                usingMessage: false, //只使用訊息討論時間地點
                selectedOption: { //賣家選擇的選項
                    start: '2023-07-07T02:59',
                    end: '2023-07-14T02:01',
                    position:  {
                        center: [ // 經緯度
                            121.54114515457269,
                            25.01396180464505
                        ],
                        name: '國立臺灣科技大學圖書館 大門口'
                    }
                },
                actual: {  //實際借用歸還時間
                    start: '2023-07-06T03:03',
                    end: '2023-07-06T03:04' 
                }
            }
        }
        ```
    - `put`
        - body when `mode=1`
        ```JavaScript
        {   //有選擇時間
            usingMessage : false,
            selectedOption : {
                start: '2023-07-07T02:59',
                end: '2023-07-14T02:01',
                position: {
                    center: [ // 經緯度
                        121.54114515457269,
                        25.01396180464505
                    ],
                    name: '國立臺灣科技大學圖書館 大門口'
                }
            }
        }
        or
        {   //只使用訊息討論時間地點
            usingMessage : true,
            selectedOption : {
                start: '',
                end: '',
                position: {
                    center: [0, 0],
                    name: ''
                }
            }
        }
        ```
        - body when `mode=2,3,4`
        ```JavaScript
        {

        }
        ```
        - response
        ```JavaScript
        {
            success : true or false //操作是否成功
        }
        ```
        - 提醒
            - 取消訂單(2)和歸還商品(4)時，記得更新資料庫的商品剩餘數量與借出數量
            - progress 改變時要將買賣家雙方已讀狀態設為 false
</details>

### `/api/order/overview/`
<details>

- 用途
    - 取得數個訂單 (status=provider)
    - 取得數個購買清單 (status=consumer)
- params
    - headers
        ```JavaScript
        {
            authorization : token //JWT token
        }
        ```
    - `?progress=`
        - 表示訂單進度
    - `?status=`
        - 表示目前身分
        - provider 賣家
        - consumer 買家
- method
    - `get`
        - response
        ```JavaScript
        {
            success : true or false,
            orders : [
                {
                    order_id: 'a7b1cd20-f4e6-4b62-b013-250e2ceb3610',
                    nickname: '弦巻こころ',
                    cover: 'img/8da5912c-48a5-4aec-a61b-377789dfd8a9.png',
                    totalprice: 100,
                    items: [ '石頭' ]
                },
                {
                    order_id: 'asdfsdfsdf-fsdfsd-f-sdfsdf',
                    nickname: '弦巻こころ',
                    cover: 'img/8da5912c-48a5-4aec-a61b-377789dfd8a9.png',
                    totalprice: 1290,
                    items: [ 'Elden Ring' ]
                }
            ]
        }
        ```
</details>

### `/api/order/notify/`
<details>

- 用途
    - `get` 取得訂單更新通知
    - `put` 標示訂單通知已讀
- params
    - headers
        ```JavaScript
        {
            authorization : token //JWT token
        }
        ```
    - `?id=`
        - `put` 時表示已讀的訂單標號(1個)
    - `?all=true`
        - `put` 時將所有通知標記已讀(全部)
- method
    - `get`
        - response
        ```JavaScript
        success: true, //是否取得成功
        consumer_orderlist: [], //個人通知
        provider_orderlist: [ //賣場通知
            {
                order_id: 'c65441a5-0664-477c-9f93-7fe182d36041', //自定義商品 id
                cover: 'img/8da5912c-48a5-4aec-a61b-377789dfd8a9.png', //拿第一張圖
                progress: 0, //訂單進度
                read: true //是否已讀
            },
            {
                order_id: '8031771a-d44b-4e6d-ad9b-2cc12b460c83',
                cover: 'img/88afbee0-8d69-4e1e-a3df-b346f01f0e2f.jpeg',
                progress: 1,
                read: false
            }
        ]
        ```
    - `put`
        - body
        ```JavaScript
        {

        }
        ```
        - response
        ```JavaScript
        {
            success: true, //是否成功
        }
        ```
</details>

## 個人檔案
###  `/api/userfile/profile/`
<details>

- 用途
    - 拿個人資料
    - 更新個人資料
    - 手機跟信箱還有驗證問題，這邊沒有處理
- params
    - headers
        ```JavaScript
        {
            authorization : token //JWT token
        }
        ```
- method
    - `get`
        - response
        ```JavaScript
        {
            success: true, //身分驗證成功
            profile: {  // 個人檔案
                account: 'kokoro123',
                nickname: '弦巻こころ',
                phone: '0910156987',
                mail: 'kokoro123@gmail.com',
                intro: 'こころと申します'
            }
        }
        ```
    - `put`
        - body
        ```JavaScript
        {   //暱稱
            nickname: '弦巻こころ'
        } 
        or
        {   //賣場簡介
            intro: '你好'
        } 
        or
        {   //手機
            phone: '0912345678'
        } 
        or
        {   //信箱
            mail: '123@gmail.com'
        } 
        ```
        - response
        ```JavaScript
        {
            success : true //修改是否成功
        }
        ```
        - 注意
            - 暱稱和簡介確定是這樣
            - 手機和信箱尚未處理驗證
</details>

###  `/api/userfile/password_change/`
<details>

- 用途
    - 更改密碼
- params
    - headers
        ```JavaScript
        {
            authorization : token //JWT token
        }
        ```
- method
    - `post`
        - body
        ``` JavaScript
        {
            oldPassword : "kokoro123", //舊密碼
            newPassword : "kokoro12345" //新密碼
        }
        ```
        - response
        ``` JavaScript
        {
            success : true, //更改是否成功
            message : "更改成功" or "密碼錯誤" or 其他
        }
        ```
</details>

## 聊天
### `/api/chat/overview/`
<details>

- 用途
    - 取得對話過的對象及其最後一筆訊息與未讀數量
    - 要按照時間在陣列排序
    - 最新的紀錄要放在陣列的前面
    - 時間規則與之前一樣 YYYY-MM-DDThh:mm (ex. 2023-07-10T00:28)
- params
    - headers
        ```JavaScript
        {
            authorization : token //JWT token
        }
        ```
- method
    - `get`
        - response
        ```JavaScript
        {
            success: true, //取得是否成功
            list: [
                {
                    account: 'kokoro123', //對方的帳號
                    content:'你好阿\n請多指教', //最後一則訊息
                    datetime: '2023-07-10T00:28', //時間
                    nickname: '弦巻こころ', //對方的暱稱
                    number: 3 //未讀訊息數量
                },
                {
                    account: '1',
                    content: '傳送了一張圖片', //如果是圖片要改成這樣
                    datetime: '2023-07-10T00:21',
                    nickname: '1',
                    number: 0 //未讀訊息數量
                }
            ]
        }
        ```
</details>

### `/api/chat/history/`
<details>

- 用途
    - 取得與某人的對話紀錄(記得標記已讀)
- params
    - headers
        ```JavaScript
        {
            authorization : token //JWT token
        }
        ```
    - `?receiver=`
        - 要加上對方的帳號
- method
    - `get`
        - response
        ```JavaScript
        {
            success: true, //取得是否成功
            history: [ //訊息紀錄
                {
                    provider: 'kokoro123', //發送訊息的人
                    receiver: '2', //接收訊息的人
                    message_type: 'text', //訊息類型
                    content: '你好阿', //內容
                    datetime: '2023-07-09T23:30', //時間
                    id: 18  //在資料庫的id
                },
                {
                    provider: 'kokoro123',
                    receiver: '2',
                    message_type: 'img',
                    content: 'img/a9686976-cd2f-4cd4-ad91-075a10617521.png',
                    datetime: '2023-07-09T23:58',
                    id: 20
                }
            ],
            nickname: '2' //對方的暱稱
        }
        ```
</details>

### `/api/chat/notify/`
<details>

- 用途
    - `get` 回傳未讀訊息總數量
    - `put` 對某人訊息已讀
- params
    - headers
        ```JavaScript
        {
            authorization : token //JWT token
        }
        ```
    - `?receiver=`
        - `put` 時要加上對方的帳號
- method
    - `get`
        - response
        ```JavaScript
        {
            success: true, //取得是否成功
            number: 2 //未讀訊息總數量
        }
        ```
    - `put`
        - body
        ```JavaScript
        {

        }
        ```
        - response
        ```JavaScript
        {
            success: true, //是否成功
        }
        ```
</details>

## WebSocket
- 登入會有 connect 事件觸發
- 登出或離線會有 close 事件觸發
- token 放在 headers["sec-websocket-protocol"]
- `message 事件` 分類
    - `監聽 event: chat` 接收聊天訊息並處理
    - `發送 event: chat` 發送及時聊天訊息
    - `發送 event: order` 發送訂單更新時的及時通知
- 注意 `message 事件` 傳遞的是字串

### `監聽 socket.on('message', '{event: "chat", payload: ...}')`

<details>

- 用途
    - 接收聊天訊息並處理
- payload
    ```JavaScript
    {
        receiver : "kokoro123", //接收者
        message_type : "text" or "img", //類型
        content : "你好" or 圖片 //內容
    }
    ```
- 存入資料庫(參考用)
    ```JavaScript
    {provider, receiver, message_type, content, datetime, read=false}
    ```
</details>

### `發送 socket.send('{event: "chat", payload: ...}')`
<details>

- 用途
    - `socket.on("message", {event: "chat", payload: ...})`
    - 收到上面事件後傳送訊息給雙方
- payload
    ```JavaScript
    {   // 跟存入資料庫的很像，但要多加暱稱
        provider,
        receiver,
        message_type,
        content,
        datetime,
        nickname
    }
    ```
</details>

### `發送 socket.send('{event: "order", payload: ...}')`
<details>

- 用途
    - `post` `/order/order_CRUD/`
    - `put` `/order/order_CRUD/`
    - 上面兩個 api 處理完成後，傳送給買家和賣家及時通知
- payload
    ```JavaScript
    {   // 跟存入資料庫的很像，但要多加暱稱
        id : "訂單自定義 id",
        message : "已提交租借申請" or "您有一筆新訂單" or "訂單狀態已更新"
    }
    ```
</details>

## つづく
