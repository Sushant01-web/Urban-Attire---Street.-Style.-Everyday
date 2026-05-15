import React, { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import AuthLayout from "./components/auth/layout";
import AuthLogin from "./pages/auth/login";
import AuthRegister from "./pages/auth/register";
import AdminLayout from "./components/admin-view/layout";
import AdminDashboard from "./pages/admin-view/dashboard";
import AdminFeatures from "./pages/admin-view/features";
import AdminProducts from "./pages/admin-view/products";
import AdminOrders from "./pages/admin-view/orders";
import ShoppingLayout from "./components/shopping-view/layout";
import ShoppingHome from "./pages/shopping-view/home";
import ShoppingListing from "./pages/shopping-view/listing";
import ShoppingAccount from "./pages/shopping-view/account";
import ShoppingCheckout from "./pages/shopping-view/checkout";
import Notfound from "./pages/not-found";
import UnauthPage from "./pages/unauth-page";
import CheckAuth from "./components/common/check-auth";
import { useDispatch, useSelector } from "react-redux";
import { checkAuth } from "./store/auth-slice";
import { Skeleton } from "./components/ui/skeleton";
import PaypalReturn from "./components/shopping-view/paypal-return";
import PaymentSuccessPage from "./components/shopping-view/payment-success";
import SearchProducts from "./pages/shopping-view/search";

function App() {
  //this is for example while we started coding for this project-- hardcoded value
  // const isAuthenticated = false;
  // const user = null;

  //now getting isAuthenticated and user state from (auth -- that we have created in index.js as a slice and after we export it.)
  //we code this user and isauthenticated here because whole app is gonna use this
  const { user, isAuthenticated, isLoading } = useSelector(
    (state) => state.auth
  );

  //every time user refreshes page he will stay on that page only
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  //aftre refresh for minute second this div we have to show -- this will represent app is loading
  if (isLoading)
    return <Skeleton className="h-[600px] w-[600px] rounded-full" />;

  return (
    <div className="flex flex-col overflow-hidden bg-white">
      {/* importin routes to navigate endoints */}
      <Routes>
        <Route
        path="/"
        element={<CheckAuth isAuthenticated={isAuthenticated} user={user}>
            </CheckAuth>}
        />

        <Route 
          path="auth"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <AuthLayout />
            </CheckAuth>
          }
        >
          <Route path="login" element={<AuthLogin />} />
          <Route path="register" element={<AuthRegister />} />
        </Route>

        {/* creating routing for Admin panel and pages */}
        <Route
          path="/admin"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <AdminLayout />
            </CheckAuth>
          }
        >
          {/* importing children routes of admin */}
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="features" element={<AdminFeatures />} />
          <Route path="orders" element={<AdminOrders />} />
        </Route>

        {/* creating routing for shoppig pages */}
        <Route
          path="/shop"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <ShoppingLayout />
            </CheckAuth>
          }
        >
          {/* importing children routes of shopping page */}
          <Route path="home" element={<ShoppingHome />} />
          <Route path="listing" element={<ShoppingListing />} />
          <Route path="account" element={<ShoppingAccount />} />
          <Route path="checkout" element={<ShoppingCheckout />} />
          <Route path="search" element={<SearchProducts />} />
          <Route path="paypal-return" element={<PaypalReturn/>}/>
          <Route path="payment-success" element={<PaymentSuccessPage/>}/>
        </Route>

        {/* Not found page */}
        <Route path="*" element={<Notfound />}></Route>

        {/* unauthorized page */}
        <Route path="/unauth-page" element={<UnauthPage />} />
      </Routes>
    </div>
  );
}

export default App;
