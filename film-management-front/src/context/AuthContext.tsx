import React, { createContext, useContext, useEffect, useState } from "react";
import { AuthenticationResponse, UserResponse } from "../types";
import { AuthService } from "../services/auth.service";


interface AuthContextType {
    currentUser: UserResponse | null;
    isLoggedIn: boolean;
    userRole: string | null;
    login: (email: string, password: string) => Promise<void>;
    register: (name: string, lastName: string, phone: string, email: string, password: string) => Promise<void>;
    logout: () => void;
}

const authService = new AuthService();
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [currentUser, setCurrentUser] = useState<UserResponse | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [userRole, setUserRole] = useState<string | null>(null);

    useEffect(() => {
        const user = authService.getUser();
        
        if (user) {
            setCurrentUser(user);
            setIsLoggedIn(true);
            setUserRole(user.role);
        }
    }, []);

    const handleAuthResponse = (response: AuthenticationResponse) => {
        authService.saveToken(response.accessToken);
        authService.saveUser(response.user);
        
        setCurrentUser(response.user);
        setIsLoggedIn(true);
        setUserRole(response.user.role);
    };

    const login = async (email: string, password: string) => {
        const response = await authService.login({ email, password });
        
        handleAuthResponse(response);
    };

    const register = async (name: string, lastName: string, phone: string, email: string, password: string) => {
        const response = await authService.register({ name, lastName, phone, email, password });
        
        handleAuthResponse(response);
    };

    const logout = () => {
        authService.logout();
        setCurrentUser(null);
        setIsLoggedIn(false);
        setUserRole(null);
    };

    return (
        <AuthContext.Provider value={{ currentUser, isLoggedIn, userRole, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    
    if (context === undefined) throw new Error("useAuth must be used within an AuthProvider");

    return context;
};