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
