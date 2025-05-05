import React from "react";
import { useAuth } from "../context/AuthContext";
import { Navbar } from "../components";
import { UserDashboard } from "./user/UserDashboard";
import { AdminDashboard } from "./admin";


export const Dashboard: React.FC = () => {
    const { userRole } = useAuth();

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            {
                userRole === "ADMIN" ? (
                    <AdminDashboard />
                ) : (
                    <UserDashboard />
                )
            }
        </div>
    );
};