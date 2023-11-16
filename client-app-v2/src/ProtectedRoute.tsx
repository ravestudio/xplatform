import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ isLoggedIn, children }: any) => {
  // Add your own authentication on the below line.

  if (!isLoggedIn) {
    return <Navigate to={"/auth"} replace />;
  }

  return children;
};

export default ProtectedRoute;
