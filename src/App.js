/* Global CSS */
import "./global/css/body.css"
import "./global/css/navbar.css"
import "./global/css/component.css"

/* Components: pages */
import NotFound from "./NotFound"

import HomePage from "./pages/HomePage/HomePage"
import MyProducts from "./pages/MyProducts/MyProducts"
import Product from "./pages/Product/Product"
import AddProduct from "./pages/AddProduct/AddProduct"
import ShoppingCart from "./pages/ShoppingCart/ShoppingCart"
import SignIn from "./pages/Account/SignIn"
import SignUp from "./pages/Account/SignUp"

import MyCollect from "./pages/MyCollect/MyCollect"
import MyShopping from "./pages/MyShopping/MyShopping"
import MyOrder from "./pages/MyOrder/MyOrder"
import OrderDetail from "./pages/OrderDetail/OrderDetail"
import MyStore from "./pages/MyStore/MyStore"
import Bill from "./pages/Bill/Bill"
import Result from "./pages/Result/Result"
import Profile from "./pages/Profile/Profile"

import ChatList from "./pages/ChatList/ChatList"
import ChatRoom from "./pages/ChatRoom/ChatRoom"

/* React Hooks */
import { Routes, Route } from "react-router-dom"

/* React Components */
function App() {
  return <>
    <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/Result" element={<Result />} />
        <Route path="/Product" element={<Product />} />
        <Route path="/ShoppingCart" element={<ShoppingCart />} />
        <Route path="/SignIn" element={<SignIn />} />
        <Route path="/SignUp" element={<SignUp />} />
        <Route path="/MyProducts" element={<MyProducts />} />
        <Route path="/MyProducts/AddProduct" element={<AddProduct />} />
        
        <Route path="/MyCollect" element={<MyCollect />} />
        <Route path="/MyShopping" element={<MyShopping />} />
        <Route path="/MyOrder" element={<MyOrder />} />
        <Route path="/OrderDetail" element={<OrderDetail />} />
        <Route path="/MyStore" element={<MyStore />} />
        <Route path="/Bill" element={<Bill />} />
        <Route path="/Profile" element={<Profile />} />

        <Route path="/ChatList" element={<ChatList />} />
        <Route path="/ChatList/ChatRoom" element={<ChatRoom />} />
        
        <Route path="*" element={<NotFound />} />
    </Routes>
  </>
}

export default App