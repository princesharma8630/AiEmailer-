import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import RouterConstant from "../constants/routerConstant";

const PrivateRouter: React.FC = () => {
  const { isLoggedIn, isInitialized } = useSelector((state: RootState) => state.auth);
  const token = localStorage.getItem('token');

  // Show loading while checking auth status
  if (!isInitialized ) {
    return (
      <Outlet/>
    );
  }

  // Check both Redux state and localStorage token
  if (!isLoggedIn || !token || false) {
    return <Navigate to={RouterConstant.Login} replace />;
  }

  return <Outlet />;
};

export default PrivateRouter;