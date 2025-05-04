/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Button, Input } from "../components";


export const Register: React.FC = () => {
    const [formData, setFormData] = useState({
        name: "",
        lastName: "",
        phone: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);
    const [generalError, setGeneralError] = useState("");
    
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};
        
        if (!formData.name.trim()) {
            newErrors.name = "The name is required";
        } else if (!/^[a-zA-Z\sáéíóúÁÉÍÓÚñÑ]+$/.test(formData.name)) {
            newErrors.name = "The name can only contain letters";
        }
        
        if (!formData.lastName.trim()) {
            newErrors.lastName = "The last name is required";
        } else if (!/^[a-zA-Z\sáéíóúÁÉÍÓÚñÑ]+$/.test(formData.lastName)) {
            newErrors.lastName = "The last name can only contain letters";
        }
        
        if (!formData.phone.trim()) {
            newErrors.phone = "The phone number is required";
        } else if (!/^\d{10}$/.test(formData.phone)) {
            newErrors.phone = "The phone number must be 10 digits long";
        }
        
        if (!formData.email.trim()) {
            newErrors.email = "The email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "The email is not valid";
        }
        
        if (!formData.password) {
            newErrors.password = "The password is required";
        } else if (formData.password.length < 8) {
            newErrors.password = "The password must be at least 8 characters long";
        } else if (!/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()]).+$/.test(formData.password)) {
            newErrors.password = "The password must contain at least one uppercase letter, one number, and one special character";
        }
        
        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = "The passwords do not match";
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setGeneralError("");
        
        if (!validateForm()) return;
        
        setLoading(true);
        
        try {
            await register(
                formData.name,
                formData.lastName,
                formData.phone,
                formData.email,
                formData.password
            );
            navigate("/dashboard");
        } catch (err: any) {
            setGeneralError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-red-600">Films Management</h1>
                    <h2 className="mt-2 text-xl font-semibold text-gray-900">Create an account</h2>
                </div>
                
                {
                    generalError && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
                            <span className="block sm:inline">{ generalError }</span>
                        </div>
                    )
                }
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input id="name" name="name" label="Name" value={ formData.name } onChange={ handleChange } placeholder="Your name" required error={ errors.name }/>
                        <Input id="lastName" name="lastName" label="Last name" value={ formData.lastName } onChange={ handleChange } placeholder="Your last name" required error={ errors.lastName }/>
                    </div>
                
                    <Input id="phone" name="phone" type="tel" label="Phone" value={ formData.phone } onChange={ handleChange } placeholder="1234567890" required error={ errors.phone }/>
                    <Input id="email" name="email" type="email" label="Email" value={ formData.email } onChange={ handleChange } placeholder="mail@example.com" required error={ errors.email }/>
                    <Input id="password" name="password" type="password" label="Password" value={ formData.password } onChange={ handleChange } placeholder="********" required error={ errors.password }/>
                    <Input id="confirmPassword" name="confirmPassword" type="password" label="Confirm password" value={ formData.confirmPassword } onChange={ handleChange } placeholder="********" required error={ errors.confirmPassword }/>
                    
                    <Button type="submit" variant="primary" fullWidth disabled={ loading }>
                        {
                            loading ? "Loading..." : "Sign Up"
                        }
                    </Button>
                    
                    <div className="text-center mt-4">
                        <p className="text-sm text-gray-600">
                            Already have an account?{" "}
                            <Link to="/login" className="font-medium text-red-600 hover:text-red-500">
                                Sign In
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};