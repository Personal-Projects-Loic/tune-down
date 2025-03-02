import React from "react";
import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const isAuthenticated = Cookies.get("is_authenticated");

  console.log("isAuthenticated:", isAuthenticated);

  if (!isAuthenticated) {
    console.log("go prison");
    return <Navigate to="/login" />;
  } else {
    console.log("libérez le");
    console.log("Authenticated");
    return <>{children}</>;
  }
};

export default PrivateRoute;
