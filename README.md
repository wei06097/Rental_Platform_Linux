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
            options: { //買家提供的時段
                start: [ '2023-07-07T12:00', '2023-07-08T10:00' ],
                end: [ '2023-07-14T12:00', '2023-07-14T13:00' ],
                position: [ '台科大 IB 1樓', '台科大 語言中心', '捷運公館 1號出口' ]
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
            order : products, //商品數量價格等資訊
            totalprice : totalPrice, //總金額
            comment, //買家留言
            options, //買家提供的時間地點選項
            selectedOption : { //賣家選擇的時間和地點
                start : "",
                end : "",
                position : ""
            },
            actual : { //實際租借時間
                start : "",
                end : ""
            }, 
            progress : 0 //訂單進度 0待確認 1待收貨 2待歸還 3已完成 -1未完成
        }
        ```
</details>

### `/`
<details>

</details>