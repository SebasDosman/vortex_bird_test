import React, { useEffect, useRef } from "react";


interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    size?: "sm" | "md" | "lg" | "xl";
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, size = "md" }) => {
    const modalRef = useRef<HTMLDivElement>(null);
    const sizeClasses = {
        sm: "max-w-md",
        md: "max-w-lg",
        lg: "max-w-2xl",
        xl: "max-w-4xl",
    };

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };

        const handleClickOutside = (e: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(e.target as Node)) onClose();
        };

        if (isOpen) {
            document.addEventListener("keydown", handleEscape);
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("keydown", handleEscape);
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className={ `bg-white rounded-lg shadow-xl w-full ${ sizeClasses[size] } transition-all` } ref={ modalRef }>
                <div className="flex justify-between items-center border-b border-gray-200 px-6 py-4">
                    <h3 className="text-xl font-semibold text-gray-900">{ title }</h3>
                    <button onClick={ onClose } className="text-gray-400 hover:text-gray-500 focus:outline-none">
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={ 2 } d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div className="px-6 py-4">
                    { children }
                </div>
            </div>
        </div>
    );
};