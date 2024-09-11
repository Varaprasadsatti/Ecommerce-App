import { Route, Routes, useLocation } from "react-router-dom"
import AuthLayout from "./components/auth/layout"
import Register from "./pages/auth/register"
import Login from "./pages/auth/login"
import AdminLayout from "./components/admin/layout"
import AdminDashboard from "./pages/admin/dashboard"
import AdminOrders from "./pages/admin/orders"
import AdminProducts from "./pages/admin/products"
import ShoppingLayout from "./components/shopping/layout"
import NotFound from "./pages/notFound"
import ShoppingHome from "./pages/shopping/home"
import ShoppingListing from "./pages/shopping/listing"
import ShoppingAccount from "./pages/shopping/account"
import ShoppingCheckout from "./pages/shopping/checkout"
import UnauthPage from "./pages/unauth-page"
import CheckAuth from "./components/common/check-auth"
import { useDispatch, useSelector } from "react-redux"
import { useEffect } from "react"
import { checkAuth } from "./store/auth-slice"
import { Skeleton } from "@/components/ui/skeleton"
import PaypalReturnPage from "./pages/shopping/paypal-return"
import PaypalCancel from "./pages/shopping/paypal-cancel"
import PaymentSuccessPage from "./pages/shopping/payment-success"
import SearchProducts from "./pages/shopping/search"



function App() {
  const {user, isAuthenticated,isLoading} = useSelector((state)=>state.auth)

  const location = useLocation()


  const dispatch = useDispatch();

  useEffect(()=>{
    const token = JSON.parse(sessionStorage.getItem("token"))
    dispatch(checkAuth(token))
  },[dispatch])

  if (isLoading) return <Skeleton className="w-[800px] h-[600px]" />


  

  return (
    <div className="flex flex-col overflow-hidden bg-white">
      <Routes>
        <Route path="/" element={
          <CheckAuth isAuthenticated={isAuthenticated} user={user} >
          </CheckAuth>
        } />
        <Route path="/auth" element={
          <CheckAuth isAuthenticated={isAuthenticated} user={user} >
            <AuthLayout />
          </CheckAuth>
        }>
          <Route path="register" element={<Register/>} />
          <Route path="login" element={<Login/>} />
        </Route>
        <Route path="/admin" element={
          <CheckAuth isAuthenticated={isAuthenticated} user={user}>
            <AdminLayout />
          </CheckAuth>
        }>
          <Route path="dashboard" element={<AdminDashboard />}/>
          <Route path="orders" element={<AdminOrders />}/>
          <Route path="products" element={<AdminProducts />}/>
        </Route>
        <Route path="/shop" element={
          <CheckAuth isAuthenticated={isAuthenticated} user={user}>
            <ShoppingLayout />
          </CheckAuth>
        }>
          <Route path="home" element={<ShoppingHome />}/>
          <Route path="listing" element={<ShoppingListing />}/>
          <Route path="account" element={<ShoppingAccount />}/>
          <Route path="checkout" element={<ShoppingCheckout />}/>
          <Route path="paypal-return" element={<PaypalReturnPage />}/>
          <Route path="paypal-cancel" element={<PaypalCancel />}/>
          <Route path="payment-success" element={<PaymentSuccessPage />}/>
          <Route path="search" element={<SearchProducts />}/>
        </Route>
        <Route path="/unauth-page" element={<UnauthPage/>} />
        <Route path="*" element={<NotFound/>} />
      </Routes>
    </div>
  )
}

export default App
