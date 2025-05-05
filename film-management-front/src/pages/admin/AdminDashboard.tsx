import React, { useEffect } from "react";
import { Button } from "../../components";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";


export const AdminDashboard: React.FC = () => {
    const { currentUser, userRole } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!currentUser) {
        navigate("/login");
        }
    }, [currentUser, navigate]);

    if (!currentUser) return null;

    return (
        <main className="container mx-auto px-4 py-8">
            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                    {
                        userRole === "ADMIN" ? "Admin" : "User"
                    } Dashboard
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <DashboardCard title="Films Management" description="Create, update or delete films." action={ () => navigate("/admin/films") }/>
                    <DashboardCard title="Users Management" description="Create, update or delete users." action={ () => navigate("/admin/users") }/>
                    <DashboardCard title="Purchases Management" description="Read or delete purchases." action={ () => navigate("/admin/purchases") }/>
                </div>
            </div>
        </main>
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
