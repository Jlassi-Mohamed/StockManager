import AuthContext from "./AuthContext";
import { useContext } from "react";
import { Navigate } from "react-router-dom";

function ProtectedWrapper(props) {
  const user = JSON.parse(localStorage.getItem("user"))
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return props.children;
}
export default ProtectedWrapper;
