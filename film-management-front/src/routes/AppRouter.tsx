import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "../context/AuthContext";
import { Dashboard, FilmForm, FilmsManagement, Login, Register } from "../pages";
import { ProtectedRoute } from "./ProtectedRoute";


export const AppRouter: React.FC = () => {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    <Route path="/login" element={ <Login /> } />
                    <Route path="/register" element={ <Register /> } />
                    
                    <Route element={ <ProtectedRoute /> }>
                        <Route path="/dashboard" element={ <Dashboard /> } />
                        <Route path="/movies" element={ <div>Movies</div> } />
                        <Route path="/my-tickets" element={ <div>My Tickets</div> } />
                    </Route>
                    
                    <Route element={ <ProtectedRoute allowedRoles={["ADMIN"]} /> }>
                        <Route path="/admin/films" element={ <FilmsManagement/> } />
                        <Route path="/admin/films/create" element={ <FilmForm mode="create"/> } />
                        <Route path="/admin/films/edit/:id" element={ <FilmForm mode="edit"/> } />
                        <Route path="/admin/users" element={ <div>Users Management</div> } />
                    </Route>
                    
                    <Route path="/unauthorized" element={ <div>Unauthorized</div> } />
                    
                    <Route path="/" element={ <Navigate to="/login" replace /> } />
                    <Route path="*" element={ <div>404 Not Found</div> } />
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    );
};