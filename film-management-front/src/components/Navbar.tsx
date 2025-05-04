import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Button } from "./common";


export const Navbar: React.FC = () => {
    const navigate = useNavigate();
    const { currentUser, logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <header className="bg-red-600 text-white shadow-md">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                <h1 className="text-2xl font-bold cursor-pointer hover:underline" onClick={ () => navigate("/dashboard") }>
                    Films Management
                </h1>
                {
                    currentUser && (
                        <div className="flex items-center gap-4">
                            <span className="hidden md:inline-block">
                                Hi, { currentUser.name }!
                            </span>
                            <Button variant="secondary" onClick={ handleLogout }>
                                Log Out
                            </Button>
                        </div>
                    )
                }
            </div>
        </header>
    );
};
