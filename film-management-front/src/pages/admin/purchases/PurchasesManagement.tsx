/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { PurchaseResponse } from "../../../types";
import { PurchaseService } from "../../../services/purchase.service";
import { Badge, Button, ConfirmModal, Navbar, Pagination } from "../../../components";
import { formatCurrency, formatDate } from "../../../utils/utils";


const purchaseService = new PurchaseService();

export const PurchasesManagement: React.FC = () => {
    const [purchases, setPurchases] = useState<PurchaseResponse[]>([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [deletePurchaseId, setDeletePurchaseId] = useState<number | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [searchUserId, setSearchUserId] = useState("");
    const [selectedPurchase, setSelectedPurchase] = useState<PurchaseResponse | null>(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);

    const fetchPurchases = async () => {
        setIsLoading(true);
        setError(null);

        try {
            let response;

            if (searchUserId.trim()) {
                const userId = parseInt(searchUserId.trim());
                
                if (isNaN(userId)) throw new Error("User ID must be a valid number");
                
                response = await purchaseService.getPurchasesByUserId(userId, currentPage);
            } else {
                response = await purchaseService.getAllPurchases(currentPage);
            }

            setPurchases(response.content);
            setTotalPages(response.totalPages);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchPurchases();
    }, [currentPage]);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        setCurrentPage(0);
        fetchPurchases();
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleDeleteClick = (id: number) => {
        setDeletePurchaseId(id);
        setShowDeleteModal(true);
    };

    const handleDeleteConfirm = async () => {
        if (!deletePurchaseId) return;
        
        setIsDeleting(true);
        try {
            await purchaseService.deletePurchase(deletePurchaseId);

            setPurchases(purchases.filter(purchase => purchase.id !== deletePurchaseId));
            setShowDeleteModal(false);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsDeleting(false);
            setDeletePurchaseId(null);
        }
    };

    const handleViewDetails = async (purchase: PurchaseResponse) => {
        setSelectedPurchase(purchase);
        setShowDetailsModal(true);
    };

    const getPaymentMethodBadge = (method: string) => {
        switch (method) {
            case 'CREDIT_CARD':
                return <Badge text="Credit Card" variant="info" />;
            case 'PSE':
                return <Badge text="PSE" variant="warning" />;
            case 'CASH':
                return <Badge text="Cash" variant="success" />;
            case 'OTHER':
                return <Badge text="Other" variant="default" />;
            default:
                return <Badge text={ method } variant="default" />;
        }
    };

    const getPaymentStatusBadge = (status: string) => {
        switch (status) {
            case 'PAID':
                return <Badge text="Paid" variant="success" />;
            case 'PENDING':
                return <Badge text="Pending" variant="warning" />;
            case 'CANCELLED':
                return <Badge text="Cancelled" variant="danger" />;
            default:
                return <Badge text={ status } variant="default" />;
        }
    };

    return (
        <>
            <Navbar />
            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">Purchases Management</h1>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
                        <form onSubmit={ handleSearch } className="flex w-full md:w-1/2">
                            <input type="text" value={ searchUserId } onChange={ (e) => setSearchUserId(e.target.value) } placeholder="Search by User ID..." className="w-full px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"/>
                            <Button type="submit" className="rounded-l-none">Search</Button>
                        </form>
                    </div>

                    {
                        error && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
                                <span className="block sm:inline">{ error }</span>
                            </div>
                        )
                    }

                    {
                        isLoading ? (
                            <div className="text-center py-8">
                                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-red-600 border-r-transparent"></div>
                                <p className="mt-2 text-gray-600">Loading purchases...</p>
                            </div>
                        ) : purchases.length === 0 ? (
                            <div className="text-center py-8">
                                <p className="text-gray-600">No purchases found.</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User ID</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Purchase Date</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Amount</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Method</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Status</th>
                                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {
                                            purchases.map((purchase) => (
                                                <tr key={ purchase.id } className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm font-medium text-gray-900">{ purchase.id }</div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm text-gray-700">{ purchase.userId }</div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm text-gray-700">{ formatDate(new Date(purchase.purchaseDate)) }</div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm text-gray-700">{ formatCurrency(purchase.totalAmount) }</div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        { getPaymentMethodBadge(purchase.paymentMethod) }
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        { getPaymentStatusBadge(purchase.paymentStatus) }
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                        <div className="flex justify-end space-x-2">
                                                            <button className="text-blue-600 hover:text-blue-900"onClick={ () => handleViewDetails(purchase) }>
                                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                </svg>
                                                            </button>
                                                            <button className="text-red-600 hover:text-red-900" onClick={ () => handleDeleteClick(purchase.id) }>
                                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                                                </svg>
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        }
                                    </tbody>
                                </table>
                            </div>
                        )
                    }

                    {
                        totalPages > 1 && !isLoading && purchases.length > 0 && (
                            <Pagination currentPage={ currentPage } totalPages={ totalPages } onPageChange={ handlePageChange } />
                        )
                    }
                </div>

                <ConfirmModal isOpen={ showDeleteModal } onClose={ () => setShowDeleteModal(false) } onConfirm={ handleDeleteConfirm } title="Delete Purchase" message="Are you sure you want to delete this purchase? This action cannot be undone." confirmText="Delete" cancelText="Cancel" isLoading={ isDeleting } />

                {
                    selectedPurchase && (
                        <div className={ `fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center ${ showDetailsModal ? 'block' : 'hidden' }` }>
                            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                                <div className="p-6">
                                    <div className="flex justify-between items-center mb-4">
                                        <h2 className="text-xl font-bold text-gray-800">Purchase Details</h2>
                                        <button onClick={ () => setShowDetailsModal(false) }className="text-gray-500 hover:text-gray-700">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={ 1.5 } stroke="currentColor" className="w-6 h-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                        <div>
                                            <p className="text-sm text-gray-500">Purchase ID</p>
                                            <p className="text-lg font-medium">{ selectedPurchase.id }</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">User ID</p>
                                            <p className="text-lg font-medium">{ selectedPurchase.userId }</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Purchase Date</p>
                                            <p className="text-lg font-medium">{ formatDate(new Date(selectedPurchase.purchaseDate)) }</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Total Amount</p>
                                            <p className="text-lg font-medium">{ formatCurrency(selectedPurchase.totalAmount) }</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Payment Method</p>
                                            <div className="mt-1">{ getPaymentMethodBadge(selectedPurchase.paymentMethod) }</div>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Payment Status</p>
                                            <div className="mt-1">{ getPaymentStatusBadge(selectedPurchase.paymentStatus) }</div>
                                        </div>
                                    </div>
                                    
                                    <h3 className="text-lg font-bold text-gray-800 mb-4">Purchase Items</h3>
                                    
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Film</th>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit Price</th>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subtotal</th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {
                                                    selectedPurchase.details.map((detail) => (
                                                        <tr key={ detail.id } className="hover:bg-gray-50">
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <div className="flex items-center">
                                                                    {
                                                                        detail.film.imageUrl && (
                                                                            <img src={ detail.film.imageUrl } alt={ detail.film.title } className="h-12 w-8 object-cover rounded mr-3"/>
                                                                        )
                                                                    }
                                                                    <div>
                                                                        <div className="text-sm font-medium text-gray-900">{ detail.film.title }</div>
                                                                        <div className="text-xs text-gray-500">{ detail.film.genre }</div>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <div className="text-sm text-gray-700">{ detail.quantity }</div>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <div className="text-sm text-gray-700">{ formatCurrency(detail.unitPrice) }</div>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <div className="text-sm font-medium text-gray-900">{ formatCurrency(detail.quantity * detail.unitPrice) }</div>
                                                            </td>
                                                        </tr>
                                                    ))
                                                }
                                            </tbody>
                                        </table>
                                    </div>
                                    
                                    <div className="mt-6 flex justify-end">
                                        <Button variant="secondary" onClick={ () => setShowDetailsModal(false) }>
                                            Close
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                }
            </div>
        </>
    );
};