import React from "react";
import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const isAuthenticated = Cookies.get("is_authenticated");

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  } else {
    console.log("Authenticated");
    return <>{children}</>;
  }
};

export default PrivateRoute;
