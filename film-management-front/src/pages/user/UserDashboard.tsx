/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { FilmResponse, PaymentMethod, PurchaseResponse } from "../../types";
import { FilmService } from "../../services/film.service";
import { PurchaseService } from "../../services/purchase.service";
import { AuthService } from "../../services/auth.service";
import { formatCurrency, formatDate } from "../../utils/utils";


const filmService = new FilmService();
const purchaseService = new PurchaseService();
const authService = new AuthService();

export const UserDashboard: React.FC = () => {
    // Active tab state - defaulting to "tickets" to prioritize ticket purchasing
    const [activeTab, setActiveTab] = useState<"tickets" | "profile">("tickets");
    
    // Films state
    const [films, setFilms] = useState<FilmResponse[]>([]);
    const [isLoadingFilms, setIsLoadingFilms] = useState(true);
    const [errorFilms, setErrorFilms] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    
    // Purchases state
    const [purchases, setPurchases] = useState<PurchaseResponse[]>([]);
    const [isLoadingPurchases, setIsLoadingPurchases] = useState(true);
    const [errorPurchases, setErrorPurchases] = useState<string | null>(null);
    
    // Purchase modal state
    const [selectedFilm, setSelectedFilm] = useState<FilmResponse | null>(null);
    const [showPurchaseModal, setShowPurchaseModal] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(PaymentMethod.CREDIT_CARD);
    const [isPurchasing, setIsPurchasing] = useState(false);
    const [purchaseSuccess, setPurchaseSuccess] = useState(false);

    // User profile state
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [profileUpdateSuccess, setProfileUpdateSuccess] = useState(false);
    const [profileUpdateError, setProfileUpdateError] = useState<string | null>(null);
    const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
    
    // Get current user ID
    const getUserId = (): number => {
        const user = authService.getUser();
        return user?.id || 0;
    };

    const fetchFilms = async () => {
        setIsLoadingFilms(true);
        setErrorFilms(null);

        try {
            const response = await filmService.getAllEnabledFilms(currentPage);
            setFilms(response.content);
            setTotalPages(response.totalPages || 1);
        } catch (err: any) {
            setErrorFilms(err.message || "Failed to load films");
        } finally {
            setIsLoadingFilms(false);
        }
    };

    const fetchUserPurchases = async () => {
        setIsLoadingPurchases(true);
        setErrorPurchases(null);

        try {
            const userId = getUserId();
            if (userId) {
                const response = await purchaseService.getPurchasesByUserId(userId, 0, 20);
                setPurchases(response.content);
            }
        } catch (err: any) {
            setErrorPurchases(err.message || "Failed to load purchase history");
        } finally {
            setIsLoadingPurchases(false);
        }
    };

    const fetchUserProfile = () => {
        const user = authService.getUser();
        if (user) {
            setName(user.name || "");
            setEmail(user.email || "");
        }
    };

    useEffect(() => {
        fetchFilms();
        fetchUserPurchases();
        fetchUserProfile();
    }, [currentPage]);

    const handleBuyTicket = (film: FilmResponse) => {
        setSelectedFilm(film);
        setQuantity(1);
        setShowPurchaseModal(true);
    };

    const handlePurchaseConfirm = async () => {
        if (!selectedFilm) return;
        
        setIsPurchasing(true);
        setPurchaseSuccess(false);

        try {
            const userId = getUserId();
            const purchaseData = {
                userId,
                paymentMethod,
                details: [
                    {
                        filmId: selectedFilm.id,
                        quantity,
                        unitPrice: selectedFilm.ticketPrice || 10.0 // Assuming a default price if not available
                    }
                ]
            };

            await purchaseService.createPurchase(purchaseData);
            setPurchaseSuccess(true);
            
            // Refresh purchases after successful purchase
            fetchUserPurchases();
            
            // Close modal after 2 seconds
            setTimeout(() => {
                setShowPurchaseModal(false);
                setPurchaseSuccess(false);
            }, 2000);
        } catch (err: any) {
            setErrorPurchases(err.message || "Failed to complete purchase");
        } finally {
            setIsPurchasing(false);
        }
    };

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsUpdatingProfile(true);
        setProfileUpdateSuccess(false);
        setProfileUpdateError(null);

        try {
            // Simple validation
            if (newPassword && newPassword !== confirmPassword) {
                throw new Error("Passwords don't match");
            }

            // Here you would call your actual update profile service
            const user = authService.getUser();
            if (user) {
                // In a real implementation, you would update the user profile
                // For now we just simulate success
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                // Update local user data
                user.name = name;
                user.email = email;
                // Save updated user to local storage or state management
                authService.saveUser(user);
                
                setProfileUpdateSuccess(true);
            }

            // Reset password fields
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } catch (err: any) {
            setProfileUpdateError(err.message || "Failed to update profile");
        } finally {
            setIsUpdatingProfile(false);
        }
    };

    const handlePageChange = (newPage: number) => {
        if (newPage >= 0 && newPage < totalPages) {
            setCurrentPage(newPage);
        }
    };

    const getPaymentMethodBadge = (method: string) => {
        switch (method) {
            case 'CREDIT_CARD':
                return <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">Credit Card</span>;
            case 'PSE':
                return <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">PSE</span>;
            case 'CASH':
                return <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Cash</span>;
            default:
                return <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">{method}</span>;
        }
    };

    return (
        <>
            <div className="p-6 bg-gray-50 min-h-screen">
                <div className="max-w-7xl mx-auto">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-3xl font-bold text-gray-800">Your Dashboard</h1>
                        
                        {/* Quick action button */}
                        <button 
                            onClick={() => {
                                setActiveTab("tickets");
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-300 flex items-center shadow-sm"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                            </svg>
                            Buy Tickets
                        </button>
                    </div>
                    
                    {/* Welcome message */}
                    <div className="bg-gradient-to-r from-red-500 to-red-700 text-white p-6 rounded-lg shadow-md mb-6">
                        <div className="flex items-start md:items-center justify-between flex-col md:flex-row gap-4">
                            <div>
                                <h2 className="text-2xl font-bold mb-2">Welcome back!</h2>
                                <p className="text-red-100">Ready to watch the latest movies? Browse our selection and book your tickets today.</p>
                            </div>
                            <div className="flex-shrink-0">
                                <button
                                    onClick={() => {
                                        window.scrollTo({ top: document.getElementById('movies-section')?.offsetTop || 0, behavior: 'smooth' });
                                    }}
                                    className="px-6 py-3 bg-white text-red-600 rounded-md hover:bg-red-50 transition-colors duration-300 font-medium shadow-sm"
                                >
                                    Browse Movies
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    {/* Tab navigation */}
                    <div className="mb-6 border-b border-gray-200">
                        <nav className="flex space-x-8" aria-label="Tabs">
                            <button
                                onClick={() => setActiveTab("tickets")}
                                className={`py-4 px-1 ${activeTab === "tickets" 
                                    ? "border-b-2 border-red-500 text-red-600" 
                                    : "text-gray-500 hover:text-gray-700 hover:border-gray-300"} 
                                    font-medium text-sm sm:text-base`}
                            >
                                Buy Tickets & History
                            </button>
                            <button
                                onClick={() => setActiveTab("profile")}
                                className={`py-4 px-1 ${activeTab === "profile" 
                                    ? "border-b-2 border-red-500 text-red-600" 
                                    : "text-gray-500 hover:text-gray-700 hover:border-gray-300"} 
                                    font-medium text-sm sm:text-base`}
                            >
                                Profile Settings
                            </button>
                        </nav>
                    </div>

                    {/* Tab content */}
                    {activeTab === "tickets" ? (
                        <div>
                            <div id="movies-section" className="bg-white rounded-lg shadow-md p-6 mb-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-xl font-bold text-gray-800">Movies Now Playing</h2>
                                    
                                    {/* Sort/filter options could go here */}
                                    <div className="flex items-center space-x-2">
                                        <select 
                                            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                            defaultValue="latest"
                                        >
                                            <option value="latest">Latest</option>
                                            <option value="popular">Most Popular</option>
                                            <option value="priceAsc">Price: Low to High</option>
                                            <option value="priceDesc">Price: High to Low</option>
                                        </select>
                                    </div>
                                </div>
                                
                                {errorFilms && (
                                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
                                        <span className="block sm:inline">{errorFilms}</span>
                                    </div>
                                )}
                                
                                {isLoadingFilms ? (
                                    <div className="text-center py-8">
                                        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-red-600 border-r-transparent"></div>
                                        <p className="mt-2 text-gray-600">Loading films...</p>
                                    </div>
                                ) : films.length === 0 ? (
                                    <div className="text-center py-8">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                                        </svg>
                                        <p className="mt-4 text-gray-600">No films available at the moment.</p>
                                        <p className="text-gray-500">Please check back later.</p>
                                    </div>
                                ) : (
                                    <>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                            {films.map((film) => (
                                                <div key={film.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
                                                    <div className="h-48 bg-gray-200 relative">
                                                        {film.imageUrl ? (
                                                            <img 
                                                                src={film.imageUrl} 
                                                                alt={film.title} 
                                                                className="w-full h-full object-cover"
                                                            />
                                                        ) : (
                                                            <div className="flex items-center justify-center h-full">
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                                                                </svg>
                                                            </div>
                                                        )}
                                                        {/* Add a quick buy button overlay */}
                                                        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                                                            <button
                                                                onClick={() => handleBuyTicket(film)}
                                                                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-300"
                                                            >
                                                                Quick Buy
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <div className="p-4">
                                                        <h3 className="text-lg font-bold text-gray-800 mb-1">{film.title}</h3>
                                                        <div className="flex items-center justify-between mb-2">
                                                            <span className="text-sm text-gray-600">{film.genre}</span>
                                                            <span className="text-sm text-gray-600">{film.duration} min</span>
                                                        </div>
                                                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{film.description}</p>
                                                        <div className="flex items-center justify-between">
                                                            <span className="font-bold text-lg text-red-600">{formatCurrency(film.ticketPrice || 10.0)}</span>
                                                            <button
                                                                onClick={() => handleBuyTicket(film)}
                                                                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-300"
                                                            >
                                                                Buy Ticket
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        
                                        {/* Pagination controls */}
                                        {totalPages > 1 && (
                                            <div className="flex justify-center mt-8">
                                                <nav className="flex items-center space-x-2" aria-label="Pagination">
                                                    <button
                                                        onClick={() => handlePageChange(currentPage - 1)}
                                                        disabled={currentPage === 0}
                                                        className={`px-3 py-2 rounded-md ${
                                                            currentPage === 0 
                                                                ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
                                                                : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
                                                        }`}
                                                    >
                                                        Previous
                                                    </button>
                                                    
                                                    {[...Array(totalPages)].map((_, i) => (
                                                        <button
                                                            key={i}
                                                            onClick={() => handlePageChange(i)}
                                                            className={`px-3 py-2 rounded-md ${
                                                                i === currentPage
                                                                    ? "bg-red-600 text-white" 
                                                                    : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
                                                            }`}
                                                        >
                                                            {i + 1}
                                                        </button>
                                                    ))}
                                                    
                                                    <button
                                                        onClick={() => handlePageChange(currentPage + 1)}
                                                        disabled={currentPage === totalPages - 1}
                                                        className={`px-3 py-2 rounded-md ${
                                                            currentPage === totalPages - 1
                                                                ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
                                                                : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
                                                        }`}
                                                    >
                                                        Next
                                                    </button>
                                                </nav>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>

                            <div className="bg-white rounded-lg shadow-md p-6">
                                <h2 className="text-xl font-bold text-gray-800 mb-4">Your Purchase History</h2>
                                
                                {errorPurchases && (
                                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
                                        <span className="block sm:inline">{errorPurchases}</span>
                                    </div>
                                )}
                                
                                {isLoadingPurchases ? (
                                    <div className="text-center py-8">
                                        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-red-600 border-r-transparent"></div>
                                        <p className="mt-2 text-gray-600">Loading purchase history...</p>
                                    </div>
                                ) : purchases.length === 0 ? (
                                    <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                        </svg>
                                        <h3 className="mt-4 text-lg font-medium text-gray-900">No purchase history</h3>
                                        <p className="mt-1 text-gray-500">You haven't made any purchases yet.</p>
                                        <button
                                            onClick={() => window.scrollTo({ top: document.getElementById('movies-section')?.offsetTop || 0, behavior: 'smooth' })}
                                            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-300"
                                        >
                                            Browse Movies
                                        </button>
                                    </div>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Films</th>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Method</th>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {purchases.map((purchase) => (
                                                    <tr key={purchase.id} className="hover:bg-gray-50">
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="text-sm text-gray-900">{formatDate(new Date(purchase.purchaseDate))}</div>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <div className="text-sm text-gray-900">
                                                                <ul>
                                                                    {purchase.details.map((detail) => (
                                                                        <li key={detail.id} className="mb-1 last:mb-0">
                                                                            {detail.film.title} ({detail.quantity}x)
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            {getPaymentMethodBadge(purchase.paymentMethod)}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="text-sm font-medium text-gray-900">{formatCurrency(purchase.totalAmount)}</div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <h2 className="text-xl font-bold text-gray-800 mb-6">Profile Settings</h2>
                                
                                {profileUpdateSuccess && (
                                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4" role="alert">
                                        <span className="block sm:inline">Profile updated successfully!</span>
                                    </div>
                                )}
                                
                                {profileUpdateError && (
                                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
                                        <span className="block sm:inline">{profileUpdateError}</span>
                                    </div>
                                )}
                                
                                <form onSubmit={handleUpdateProfile}>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                                Name
                                            </label>
                                            <input
                                                type="text"
                                                id="name"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                className="px-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                                Email
                                            </label>
                                            <input
                                                type="email"
                                                id="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="px-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                                required
                                            />
                                        </div>
                                    </div>
                                    
                                    <div className="mt-6">
                                        <h3 className="text-lg font-medium text-gray-800 mb-4">Change Password</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label htmlFor="current-password" className="block text-sm font-medium text-gray-700 mb-1">
                                                    Current Password
                                                </label>
                                                <input
                                                    type="password"
                                                    id="current-password"
                                                    value={currentPassword}
                                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                                    className="px-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                                />
                                            </div>
                                            <div></div>
                                            <div>
                                                <label htmlFor="new-password" className="block text-sm font-medium text-gray-700 mb-1">
                                                    New Password
                                                </label>
                                                <input
                                                    type="password"
                                                    id="new-password"
                                                    value={newPassword}
                                                    onChange={(e) => setNewPassword(e.target.value)}
                                                    className="px-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-1">
                                                    Confirm New Password
                                                </label>
                                                <input
                                                    type="password"
                                                    id="confirm-password"
                                                    value={confirmPassword}
                                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                                    className="px-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="mt-8">
                                        <button
                                            type="submit"
                                            className="px-6 py-3 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-300 flex items-center justify-center"
                                            disabled={isUpdatingProfile}
                                        >
                                            {isUpdatingProfile ? (
                                                <>
                                                    <div className="h-5 w-5 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                    Updating...
                                                </>
                                            ) : 'Update Profile'}
                                        </button>
                                    </div>
                                </form>
                                
                                {/* User preferences section could be added here */}
                                <div className="mt-8 pt-6 border-t border-gray-200">
                                    <h3 className="text-lg font-medium text-gray-800 mb-4">Preferences</h3>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h4 className="text-sm font-medium text-gray-700">Email Notifications</h4>
                                                <p className="text-sm text-gray-500">Receive email about new movie releases and promotions</p>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input type="checkbox" className="sr-only peer" defaultChecked />
                                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                                            </label>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h4 className="text-sm font-medium text-gray-700">SMS Notifications</h4>
                                                <p className="text-sm text-gray-500">Receive text messages about your upcoming movie tickets</p>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input type="checkbox" className="sr-only peer" />
                                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    }
                </div>
            </div>

            {/* Purchase Modal */}
            {showPurchaseModal && selectedFilm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-lg w-full mx-auto overflow-hidden">
                        <div className="flex justify-between items-center p-4 border-b border-gray-200">
                            <h3 className="text-lg font-bold text-gray-800">Purchase Tickets</h3>
                            <button 
                                onClick={() => setShowPurchaseModal(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        
                        {purchaseSuccess ? (
                            <div className="p-6 text-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-green-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <h3 className="text-xl font-bold text-gray-800 mb-2">Purchase Successful!</h3>
                                <p className="text-gray-600 mb-4">Your tickets have been purchased successfully.</p>
                                <button
                                    onClick={() => setShowPurchaseModal(false)}
                                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-300"
                                >
                                    Close
                                </button>
                            </div>
                        ) : (
                            <div className="p-6">
                                <div className="flex items-start mb-4">
                                    <div className="flex-shrink-0 h-20 w-16 bg-gray-200 rounded overflow-hidden mr-4">
                                        {selectedFilm.imageUrl ? (
                                            <img 
                                                src={selectedFilm.imageUrl} 
                                                alt={selectedFilm.title} 
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="flex items-center justify-center h-full">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                                                </svg>
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-bold text-gray-800">{selectedFilm.title}</h4>
                                        <div className="flex items-center text-sm text-gray-600 mt-1">
                                            <span className="mr-3">{selectedFilm.genre}</span>
                                            <span>{selectedFilm.duration} min</span>
                                        </div>
                                        <div className="mt-2 text-red-600 font-bold">
                                            {formatCurrency(selectedFilm.ticketPrice || 10.0)} per ticket
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="mt-6">
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Quantity
                                        </label>
                                        <div className="flex items-center">
                                            <button
                                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                                className="px-3 py-1 border border-gray-300 rounded-l-md hover:bg-gray-100"
                                            >
                                                -
                                            </button>
                                            <input
                                                type="number"
                                                min="1"
                                                value={quantity}
                                                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                                                className="w-16 px-3 py-1 border-t border-b border-gray-300 text-center focus:outline-none"
                                            />
                                            <button
                                                onClick={() => setQuantity(quantity + 1)}
                                                className="px-3 py-1 border border-gray-300 rounded-r-md hover:bg-gray-100"
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>
                                    
                                    <div className="mb-6">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Payment Method
                                        </label>
                                        <div className="grid grid-cols-3 gap-3">
                                            <div
                                                onClick={() => setPaymentMethod(PaymentMethod.CREDIT_CARD)}
                                                className={`p-3 border rounded-md cursor-pointer text-center transition-colors duration-200 ${
                                                    paymentMethod === PaymentMethod.CREDIT_CARD 
                                                        ? "border-red-500 bg-red-50" 
                                                        : "border-gray-300 hover:bg-gray-50"
                                                }`}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mx-auto mb-1 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                                </svg>
                                                <span className="text-sm">Credit Card</span>
                                            </div>
                                            <div
                                                onClick={() => setPaymentMethod(PaymentMethod.PSE)}
                                                className={`p-3 border rounded-md cursor-pointer text-center transition-colors duration-200 ${
                                                    paymentMethod === PaymentMethod.PSE 
                                                        ? "border-red-500 bg-red-50" 
                                                        : "border-gray-300 hover:bg-gray-50"
                                                }`}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mx-auto mb-1 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                                </svg>
                                                <span className="text-sm">PSE</span>
                                            </div>
                                            <div
                                                onClick={() => setPaymentMethod(PaymentMethod.CASH)}
                                                className={`p-3 border rounded-md cursor-pointer text-center transition-colors duration-200 ${
                                                    paymentMethod === PaymentMethod.CASH 
                                                        ? "border-red-500 bg-red-50" 
                                                        : "border-gray-300 hover:bg-gray-50"
                                                }`}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mx-auto mb-1 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                                                </svg>
                                                <span className="text-sm">Cash</span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="border-t border-gray-200 pt-4 mb-6">
                                        <div className="flex justify-between mb-2">
                                            <span className="text-gray-600">Subtotal</span>
                                            <span className="text-gray-800">{formatCurrency((selectedFilm.ticketPrice || 10.0) * quantity)}</span>
                                        </div>
                                        <div className="flex justify-between mb-2">
                                            <span className="text-gray-600">Service Fee</span>
                                            <span className="text-gray-800">{formatCurrency(0.21 * (selectedFilm.ticketPrice * quantity))}</span>
                                        </div>
                                        <div className="flex justify-between font-bold text-lg">
                                            <span>Total</span>
                                            <span className="text-red-600">{formatCurrency((((selectedFilm.ticketPrice || 10.0)) * quantity) + (0.21 * (selectedFilm.ticketPrice * quantity)))}</span>
                                        </div>
                                    </div>
                                    
                                    <div className="flex justify-end space-x-3">
                                        <button
                                            onClick={() => setShowPurchaseModal(false)}
                                            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors duration-300"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handlePurchaseConfirm}
                                            disabled={isPurchasing}
                                            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-300 flex items-center"
                                        >
                                            {isPurchasing ? (
                                                <>
                                                    <div className="h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                    Processing...
                                                </>
                                            ) : 'Confirm Purchase'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};