import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components";


export const Dashboard: React.FC = () => {
    const { currentUser, userRole, logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!currentUser) {
        navigate("/login");
        }
    }, [currentUser, navigate]);

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    if (!currentUser) return null;

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-red-600 text-white shadow-md">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold">Films Management</h1>
                    <div className="flex items-center gap-4">
                        <span className="hidden md:inline-block">
                            Hi, { currentUser.name }!
                        </span>
                        <Button variant="secondary" onClick={ handleLogout }>
                            Log Out
                        </Button>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8">
                <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                    {
                        userRole === "ADMIN" ? "Admin" : "User"
                    } Dashboard
                </h2>

                {
                    userRole === "ADMIN" ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <DashboardCard title="Films Management" description="Create, update or delete movies." action={() => navigate("/admin/movies")}/>
                            <DashboardCard title="Users Management" description="Create, update or delete users." action={() => navigate("/admin/users")}/>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <DashboardCard title="Movies" description="View the current movies." action={() => navigate("/movies")}/>
                            <DashboardCard title="My Tickets" description="View your purchased tickets." action={() => navigate("/tickets")}/>
                            <DashboardCard title="My Profile" description="Update your profile information." action={() => navigate("/profile")}/>
                        </div>
                    )
                }
                </div>
            </main>
        </div>
    );
};

const DashboardCard: React.FC<{ title: string; description: string; action: () => void;}> = ({ title, description, action }) => (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
        <h3 className="text-xl font-semibold text-red-600 mb-2">{ title }</h3>
        <p className="text-gray-600 mb-4">{ description }</p>
        <Button variant="outline" onClick={ action }>
            Access
        </Button>
    </div>
);