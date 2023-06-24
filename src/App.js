/* import */
/* ======================================== */
/* Global CSS */
import "./global/css/body.css"
import "./global/css/navbar.css"
import "./global/css/component.css"
import "./global/css/loading-ring.css"
/* Components: pages */
import NotFound from "./pages/NotFound"
import HomePage from "./pages/HomePage/HomePage"
import MyProducts from "./pages/MyProducts/MyProducts"
import Product from "./pages/Product/Product"
import EditProduct from "./pages/EditProduct/EditProduct"
import ShoppingCart from "./pages/ShoppingCart/ShoppingCart"
import SignIn from "./pages/Account/SignIn"
import SignUp from "./pages/Account/SignUp"
import MyCollect from "./pages/MyCollect/MyCollect"
import MyShopping from "./pages/MyShopping/MyShopping"
import MyOrder from "./pages/MyOrder/MyOrder"
import OrderDetail from "./pages/OrderDetail/OrderDetail"
import Store from "./pages/Store/Store"
import Bill from "./pages/Bill/Bill"
import Result from "./pages/Result/Result"
import Profile from "./pages/Profile/Profile"
import ChatList from "./pages/ChatList/ChatList"
import ChatRoom from "./pages/ChatRoom/ChatRoom"
/* React Hooks */
import { Routes, Route } from "react-router-dom"
import SocketProvider from "./global/hooks/SocketProvider"
/* Redux */
import { Provider } from "react-redux"
import { PersistGate } from "redux-persist/integration/react"
import store, { persistor } from "./store"

/* ======================================== */
/* React Components */
function App() {
  return <>
      <Provider store={store}>
      <PersistGate persistor={persistor}>
      <SocketProvider>
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/SignIn" element={<SignIn />} />
            <Route path="/SignUp" element={<SignUp />} />
            <Route path="/ChatList" element={<ChatList />} />
            <Route path="/ChatRoom/:receiver" element={<ChatRoom />} />
            <Route path="/Store/:seller" element={<Store />} />
            <Route path="/MyProducts" element={<MyProducts />} />
            <Route path="/EditProduct/:id" element={<EditProduct />} />

            <Route path="/Result" element={<Result />} />
            <Route path="/Product/:id" element={<Product />} />
            <Route path="/ShoppingCart" element={<ShoppingCart />} /> 
            <Route path="/MyCollect" element={<MyCollect />} />
            <Route path="/MyShopping" element={<MyShopping />} />
            <Route path="/MyOrder" element={<MyOrder />} />
            <Route path="/OrderDetail" element={<OrderDetail />} />
            <Route path="/Bill" element={<Bill />} />
            <Route path="/Profile" element={<Profile />} />

            <Route path="*" element={<NotFound />} />
        </Routes>
      </SocketProvider>
      </PersistGate>
      </Provider>
  </>
}

export default App