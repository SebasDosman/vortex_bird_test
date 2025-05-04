/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CreateUserRequest, UpdateUserRequest } from "../../../types";
import { UserService } from "../../../services/user.service";
import { Button } from "../../../components";


const userService = new UserService();

interface UserFormProps {
    mode: "create" | "edit";
}

export const UserForm: React.FC<UserFormProps> = ({ mode }) => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    const [user, setUser] = useState<CreateUserRequest>({
        name: "",
        lastName: "",
        phone: "",
        email: "",
        password: ""
    });

    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordMismatch, setPasswordMismatch] = useState(false);

    useEffect(() => {
        if (mode === "edit" && id) {
            const fetchUser = async () => {
                setIsLoading(true);
                try {
                    const userData = await userService.getUserById(Number(id));
                    setUser({
                        name: userData.name,
                        lastName: userData.lastName,
                        phone: userData.phone,
                        email: userData.email,
                        password: "" 
                    });
                } catch (err: any) {
                    setError(err.message);
                } finally {
                    setIsLoading(false);
                }
            };
            
            fetchUser();
        }
    }, [id, mode]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setUser(prev => ({
            ...prev,
            [name]: value
        }));

        if (name === "password" || name === "confirmPassword") setPasswordMismatch(false);
    };

    const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setConfirmPassword(e.target.value);
        setPasswordMismatch(false);
    };

    const validateForm = () => {
        if (mode === "create" || (mode === "edit" && user.password)) {
            if (user.password !== confirmPassword) {
                setPasswordMismatch(true);

                return false;
            }
        }

        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validateForm()) return;

        setIsLoading(true);
        setError(null);

        try {
            if (mode === "create") {
                await userService.createUser(user);
                navigate("/admin/users");
            } else if (mode === "edit" && id) {
                const updateData: UpdateUserRequest = {
                    ...user,
                    id: Number(id),
                }

                await userService.updateUser(updateData);
                navigate("/admin/users");
            }
        } catch (err: any) {
            setError(err.message || `Error ${mode === "create" ? "creating" : "updating"} user`);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading && mode === "edit") {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-red-600 border-r-transparent"></div>
                <p className="ml-2 text-gray-600">Loading information...</p>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="flex items-center mb-6">
                <button onClick={ () => navigate("/admin/users") } className="mr-4 text-gray-600 hover:text-gray-900">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={ 1.5 } stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                    </svg>
                </button>
                <h1 className="text-2xl font-bold text-gray-800">
                    { mode === "create" ? "Create User" : "Edit User" }
                </h1>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
                {
                    error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
                            <span className="block sm:inline">{ error }</span>
                        </div>
                    )
                }

                <form onSubmit={ handleSubmit } className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                Name <span className="text-red-500">*</span>
                            </label>
                            <input type="text" id="name" name="name" value={ user.name } onChange={ handleInputChange } required className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"/>
                        </div>

                        <div>
                            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                                Last Name <span className="text-red-500">*</span>
                            </label>
                            <input type="text" id="lastName" name="lastName" value={ user.lastName } onChange={ handleInputChange } required className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"/>
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                Email <span className="text-red-500">*</span>
                            </label>
                            <input type="email" id="email" name="email" value={ user.email } onChange={ handleInputChange } required className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"/>
                        </div>

                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                                Phone <span className="text-red-500">*</span>
                            </label>
                            <input type="tel" id="phone" name="phone" value={ user.phone } onChange={ handleInputChange } required className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"/>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                Password { mode === "create" && <span className="text-red-500">*</span> }
                            </label>
                            <input type="password" id="password" name="password" value={ user.password } onChange={ handleInputChange } required={mode === "create"} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"/>
                            {
                                mode === "edit" && (
                                    <p className="text-xs text-gray-500 mt-1">Leave blank to keep current password</p>
                                )
                            }
                        </div>

                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                                Confirm Password { mode === "create" && <span className="text-red-500">*</span> }
                            </label>
                            <input type="password" id="confirmPassword"name="confirmPassword" value={ confirmPassword } onChange={ handleConfirmPasswordChange } required={mode === "create" || user.password.length > 0}className={`w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 ${passwordMismatch ? 'border-red-500' : ''}`}
                            />
                            {
                                passwordMismatch && (
                                    <p className="text-red-500 text-xs mt-1">Passwords do not match</p>
                                )
                            }
                        </div>
                    </div>

                    <div className="flex justify-end mt-8 space-x-4">
                        <Button type="button" variant="secondary" onClick={ () => navigate("/admin/users") } disabled={ isLoading }>
                            Cancel
                        </Button>
                        <Button type="submit" variant="primary" disabled={ isLoading }>
                            {
                                isLoading ? (
                                    <>
                                    <div className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-white border-r-transparent mr-2"></div>
                                    {mode === "create" ? "Creating..." : "Updating..."}
                                    </>
                                ) : (
                                    mode === "create" ? "Create User" : "Update User"
                                )
                            }
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};