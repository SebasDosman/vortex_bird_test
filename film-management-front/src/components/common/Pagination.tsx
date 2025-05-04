import React from "react";


interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
    const pages = Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
        if (totalPages <= 5) return i;
        if (currentPage < 3) return i;
        if (currentPage > totalPages - 3) return totalPages - 5 + i;

        return currentPage - 2 + i;
    });

    return (
        <div className="flex justify-center mt-6">
            <nav className="flex items-center space-x-1">
                <button onClick={ () => onPageChange(Math.max(0, currentPage - 1)) } disabled={ currentPage === 0 }
                    className={ `px-3 py-1 rounded-md ${ currentPage === 0
                            ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                            : "bg-white text-red-600 hover:bg-red-50 border border-red-300"
                        }`
                    }
                >
                    Previous
                </button>
                
                {
                    totalPages > 5 && currentPage >= 3 && (
                        <>
                            <button onClick={ () => onPageChange(0) } className="px-3 py-1 rounded-md bg-white text-red-600 hover:bg-red-50 border border-red-300">
                                1
                            </button>
                            <span className="px-2 py-1">...</span>
                        </>
                    )
                }
                
                {
                    pages.map((page) => (
                        <button key={ page } onClick={ () => onPageChange(page) }
                            className={ `px-3 py-1 rounded-md ${ currentPage === page
                                    ? "bg-red-600 text-white"
                                    : "bg-white text-red-600 hover:bg-red-50 border border-red-300"
                                }` 
                            }
                        >
                            { page + 1 }
                        </button>
                    ))
                }
                
                {
                    totalPages > 5 && currentPage < totalPages - 3 && (
                        <>
                            <span className="px-2 py-1">...</span>
                            <button onClick={ () => onPageChange(totalPages - 1) } className="px-3 py-1 rounded-md bg-white text-red-600 hover:bg-red-50 border border-red-300">
                                { totalPages }
                            </button>
                        </>
                    )
                }
                
                <button onClick={ () => onPageChange(Math.min(totalPages - 1, currentPage + 1)) } disabled={ currentPage === totalPages - 1 }
                    className={ `px-3 py-1 rounded-md ${ currentPage === totalPages - 1
                            ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                            : "bg-white text-red-600 hover:bg-red-50 border border-red-300"
                        }`
                    }
                >
                    Next
                </button>
            </nav>
        </div>
    );
};