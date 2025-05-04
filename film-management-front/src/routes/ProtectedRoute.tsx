import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";


interface ProtectedRouteProps {
    allowedRoles?: string[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
    const { isLoggedIn, userRole } = useAuth();

    if (!isLoggedIn) return <Navigate to="/login" replace />;
    if (allowedRoles && userRole && !allowedRoles.includes(userRole)) return <Navigate to="/unauthorized" replace />;

    return <Outlet />;
};