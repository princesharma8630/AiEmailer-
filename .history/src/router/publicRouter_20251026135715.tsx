import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import RouterConstant from "../constants/routerConstant";

const PublicRouter: React.FC = () => {
  const { isLoggedIn } = useSelector((state: RootState) => state.auth);
  const token = localStorage.getItem('token');

  // If user is logged in, redirect to dashboard
  if (isLoggedIn && token ) {
    return <Navigate to={RouterConstant.Dashboard} replace />;
  }

  return <Outlet />;
};

export default PublicRouter;