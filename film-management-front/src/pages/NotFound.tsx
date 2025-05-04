import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components";


export const NotFound: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50">
            <h1 className="text-4xl font-bold text-red-600 mb-4">404 - Page Not Found</h1>
            <p className="text-gray-700 mb-6 text-center max-w-md">
                The page you're looking for doesn't exist or has been moved.
            </p>
            <Button variant="secondary" onClick={ () => navigate("/") }>
                Back to Home
            </Button>
        </div>
    );
};
