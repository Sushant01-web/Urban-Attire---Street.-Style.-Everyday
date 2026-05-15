// this file will check all authentication

import { Navigate, useLocation } from "react-router-dom";

function CheckAuth({ isAuthenticated, user, children }) {
  // will give current location of url
  const location = useLocation();

  if(location.pathname === '/'){
    if(!isAuthenticated){
      return <Navigate to='/auth/login'/>
    }else{
      // now if user is admin user it will go to admin page
      if (user?.role === "admin") {
        return <Navigate to="/admin/dashboard" />;
      }
      // if user is normal user it will go to shopping page..
      else {
        return <Navigate to="/shop/home" />;
      }
    }
  }

  // if user is not register nor logged in.. it will redirect to login page
  if (
    !isAuthenticated &&
    !(
      location.pathname.includes("/login") ||
      location.pathname.includes("/register")
    )
  ) {
    return <Navigate to="/auth/login" />;
  }

  // if user is already logged in then it will be redirect to shoping pages or admin page
  if (
    isAuthenticated &&
    (location.pathname.includes("/login") ||
      location.pathname.includes("/register"))
  ) {
    // now if user is admin user it will go to admin page
    if (user?.role === "admin") {
      return <Navigate to="/admin/dashboard" />;
    }
    // if user is normal user it will go to shopping page..
    else {
      return <Navigate to="/shop/home" />;
    }
  }

  // if normal user is already logged in and he tries to login on admin page..throw unauthenticate page
  if (
    isAuthenticated &&
    user?.role !== "admin" &&
    location.pathname.includes("admin")
  ) {
    return <Navigate to="/unauth-page" />;
  }

  // if user is admin..then he cant access to shoppingpage directly
  if (
    isAuthenticated &&
    user?.role === "admin" &&
    location.pathname.includes("shop")
  ) {
    return <Navigate to="/admin/dashboard" />;
  }

  return <>{children}</>;
}

export default CheckAuth;
