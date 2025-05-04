import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components";


export const Unauthorized: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50">
            <h1 className="text-4xl font-bold text-red-600 mb-4">403 - Unauthorized</h1>
            <p className="text-gray-700 mb-6 text-center max-w-md">
                You don’t have permission to access this page. Please log in with an account that has the appropriate permissions.
            </p>
            <Button variant="secondary" onClick={ () => navigate("/") }>
                Go to Home
            </Button>
        </div>
    );
};
