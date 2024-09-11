import React from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Inventory from "./pages/Inventory";
import NoPageFound from "./pages/NoPageFound";
import AuthContext from "./AuthContext";
import ProtectedWrapper from "./ProtectedWrapper";
import { useEffect, useState } from "react";
import Orders from "./pages/Orders";
import Sales from "./pages/Sales";
import PurchaseDetails from "./pages/PurchaseDetails";
import Users from "./pages/Users"
import ForgotPassword from "./pages/ForgotPassword";
import AuthRedirect from "./AuthRedirect";

const App = () => {
  const [user, setUser] = useState("");
  const [loader, setLoader] = useState(true);
  let myLoginUser = JSON.parse(localStorage.getItem("user"));
  // console.log("USER: ",user)

  useEffect(() => {
    if (myLoginUser) {
      setUser(myLoginUser._id);
      setLoader(false);
    } else {
      setUser("");
      setLoader(false);
    }
  }, [myLoginUser]);

  const signin = (newUser, callback) => {
    setUser(newUser);
    callback();
  };

  const signout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  let value = { user, signin, signout };
  if (loader) 
    return (
      <>
        <style>
          {`
            .loader {
              width: 50px;
              height: 50px;
              padding: 8px;
              border-radius: 50%;
              background: #25b09b;
              --_m: 
                conic-gradient(#0000 10%, #000),
                linear-gradient(#000 0 0) content-box;
              -webkit-mask: var(--_m);
              mask: var(--_m);
              -webkit-mask-composite: source-out;
              mask-composite: subtract;
              animation: rotateAnimation 1s infinite linear;
            }
            
            @keyframes rotateAnimation {
              to {
                transform: rotate(1turn);
              }
            }
          `}
        </style>
        <div className="loader"></div>
      </>
    );
  return (
      <AuthContext.Provider value={value}>
        <BrowserRouter>
          <Routes>
              <Route
                path="/login"
                element={
                  <AuthRedirect>
                    <Login />
                  </AuthRedirect>
                }
              />
              <Route
                path="/register"
                element={
                  <AuthRedirect>
                    <Register />
                  </AuthRedirect>
                }
              />
              <Route
                path="/forgot-password"
                element={
                  <AuthRedirect>
                    <ForgotPassword />
                  </AuthRedirect>
                }
              />
            <Route
              path="/"
              element={
                <ProtectedWrapper>
                  <Layout />
                </ProtectedWrapper>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="/inventory" element={<Inventory />} />
              <Route path="/purchase-details" element={<PurchaseDetails />} />
              <Route path="/sales" element={<Sales />} />
              <Route path="/manage-orders" element={<Orders />} />
              <Route path="/manage-users" element={<Users />} />
            </Route>
            <Route path="*" element={<NoPageFound />} />
          </Routes>
        </BrowserRouter>
      </AuthContext.Provider>
  );
};

export default App;
