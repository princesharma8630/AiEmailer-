import React from "react";
import { Navigate, Outlet } from "react-router-dom";


import RouterConstant from "../constants/routerConstant";

const PublicRouter: React.FC = () => {
  
  const token = localStorage.getItem('token');

  // If user is logged in, redirect to dashboard
  if ( token ==='t') {
    return <Navigate to={RouterConstant.Dashboard} replace />;
  }

  return <Outlet />;
};

export default PublicRouter;