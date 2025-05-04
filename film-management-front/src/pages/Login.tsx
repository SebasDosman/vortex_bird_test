/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button, Input } from "../components";
import { useAuth } from "../context/AuthContext";


export const Login: React.FC = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        
        try {
            await login(email, password);
            navigate("/dashboard");
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-red-600">Films Management</h1>
                    <h2 className="mt-2 text-xl font-semibold text-gray-900">Sign In</h2>
                </div>
                
                {
                    error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
                            <span className="block sm:inline">{ error }</span>
                        </div>
                    )
                }
                
                <form onSubmit={ handleSubmit } className="space-y-6">
                    <Input id="email" name="email" type="email" label="Email" value={ email } onChange={(e) => setEmail(e.target.value)} placeholder="mail@example.com" required/>
                    <Input id="password" name="password" type="password" label="Password" value={ password } onChange={(e) => setPassword(e.target.value)} placeholder="********" required/>
                    
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"/>
                            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                                Remember me
                            </label>
                        </div>
                        
                        <div className="text-sm">
                            <a href="#" className="font-medium text-red-600 hover:text-red-500">
                                Forgot your password?
                            </a>
                        </div>
                    </div>
                    
                    <Button type="submit" variant="primary" fullWidth disabled={ loading }>
                        {
                            loading ? "Loading..." : "Sign In"
                        }
                    </Button>
                    
                    <div className="text-center mt-4">
                        <p className="text-sm text-gray-600">
                            Don't have an account?{" "}
                            <Link to="/register" className="font-medium text-red-600 hover:text-red-500">
                                Sign Up
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};