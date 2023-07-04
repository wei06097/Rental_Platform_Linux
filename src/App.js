/* import */
/* ======================================== */
/* Global CSS */
import "./global/css/body.css"
import "./global/css/navbar.css"
import "./global/css/component.css"
import "./global/css/loading-ring.css"
/* Pages */
import NotFound from "./pages/NotFound"
import SignUp from "./pages/Account/SignUp"
import SignIn from "./pages/Account/SignIn"
import Store from "./pages/Store/Store"
import MyProducts from "./pages/MyProducts/MyProducts"
import EditProduct from "./pages/EditProduct/EditProduct"
import HomePage from "./pages/HomePage/HomePage"
import Result from "./pages/Result/Result"
import Product from "./pages/Product/Product"
import ChatList from "./pages/ChatList/ChatList"
import ChatRoom from "./pages/ChatRoom/ChatRoom"
import ShoppingCart from "./pages/ShoppingCart/ShoppingCart"
import Bill from "./pages/Bill/Bill"
import MyOrder from "./pages/MyOrder/MyOrder"
import Profile from "./pages/Profile/Profile"
import OrderDetail from "./pages/OrderDetail/OrderDetail"
import MyCollect from "./pages/MyCollect/MyCollect"
/* Hooks */
import { Routes, Route } from "react-router-dom"
import SocketProvider from "./global/hooks/SocketProvider"
/* Redux */
import { Provider } from "react-redux"
import { PersistGate } from "redux-persist/integration/react"
import store, { persistor } from "./store"

/* ======================================== */
function App() {
  return <>
      <Provider store={store}>
      <PersistGate persistor={persistor}>
      <SocketProvider>
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/SignUp" element={<SignUp />} />
            <Route path="/SignIn" element={<SignIn />} />
            <Route path="/Store/:seller" element={<Store />} />
            <Route path="/MyProducts" element={<MyProducts />} />
            <Route path="/EditProduct/:id" element={<EditProduct />} />
            <Route path="/Result" element={<Result />} />
            <Route path="/Product/:id" element={<Product />} />
            <Route path="/ChatList" element={<ChatList />} />
            <Route path="/ChatRoom/:receiver" element={<ChatRoom />} />       
            <Route path="/ShoppingCart" element={<ShoppingCart />} /> 
            <Route path="/Bill/:seller" element={<Bill />} />
            <Route path="/MyOrder/:status" element={<MyOrder />} />
            <Route path="/OrderDetail" element={<OrderDetail />} />
            <Route path="/Profile" element={<Profile />} />
            <Route path="/MyCollect" element={<MyCollect />} />
            <Route path="*" element={<NotFound />} />
        </Routes>
      </SocketProvider>
      </PersistGate>
      </Provider>
  </>
}

export default App
