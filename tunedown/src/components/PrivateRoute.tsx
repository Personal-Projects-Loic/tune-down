import React from "react";
import { Navigate } from "react-router-dom";
import { auth } from "../firebase";

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const user = auth.currentUser;

  if (!user) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

export default PrivateRoute;
