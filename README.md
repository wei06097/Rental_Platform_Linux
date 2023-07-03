# 更新
### BorrowedAmount
<details>

- `/api/commodity/commodity_CRUD` 在新增/編輯商品時，傳到伺服器的 payload 不變，但要記得在資料庫多增加 BorrowedAmount 的欄位，用來記錄借出去的商品數量。
- `/api/commodity/my_commodity` 取得我的賣場所有商品時，回傳資料要多一項 BorrowedAmount。
</details>


# API 文件

## 購物車
### `/cart/cart_CRUD`
<details>

- 用途
    - 查看商品是否在購物車
    - 加入商品到購物車
    - 從購物車移除商品
- params
    - `/:id`
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

### `/cart/my_cart`
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

### `/cart/my_storecart`
<details>

- 用途
    - 取得購物車在特定賣場的商品
    - 剩餘數量為 0 也要回傳
    - 未上架商品不行回傳
    - ![](https://drive.google.com/u/0/uc?id=1QG-9rhzBx4tiZiVfnQNIg2M5flUkgsLt&export=download)
- params
    - `/:seller`
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
### `/order/new_order`
<details>

- 用途
    - 下訂單用
    - 需比對每項商品金額，若與前端傳的不一樣要回傳失敗
    - 商品剩餘數量不足要回傳失敗
    - 總金額要在後端計算
    - 成功後要用 socket 傳及時通知 (還沒用好)
    - ![](https://drive.google.com/u/0/uc?id=1nyzeu_f3AntBqWMZFg3DlxGPgbCsEEM3&export=download)
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
        ```JavaScript
        {
            expect : { //預計借用日期、預計歸還日期
                start : { date: '2023-07-07', time: '20:40' },
                end : { date: '2023-07-14', time: '20:40' }
            },
            options : { //買家提供的選項 讓賣家選擇
                start : [ //交貨時間 (最多4個最少1個)
                    { date: '2023-07-07', time: '20:40' },
                    { date: '2023-07-07', time: '20:40' }
                ],
                end : [ //歸還時間 (最多4個最少1個)
                    { date: '2023-07-07', time: '20:40' },
                    { date: '2023-07-07', time: '20:40' }
                ],
                position : [ //交貨地點 (最多4個最少1個)
                    '台科大 TR 1樓',
                    '台科大 圖書館 1樓',
                    '台科大 語言中心'
                ]
            },
            comment : '你好', //留言
            order : { //訂單本體 (json)
                '商品id': { amount: 數量, price: 金額 },
                '3': { amount: 1, price: 1000 },
                '8': { amount: 3, price: 500 },
                '15': { amount: 10, price: 10 }
            }
        }
        ```
        - response
        ```JavaScript
        {
            success : true or false //訂單是否成功
        }
        ```
</details>

### `/`
<details>

</details>