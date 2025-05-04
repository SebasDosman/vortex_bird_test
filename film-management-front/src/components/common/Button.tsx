import React from "react";


interface ButtonProps {
    type?: "button" | "submit" | "reset";
    onClick?: () => void;
    className?: string;
    disabled?: boolean;
    children: React.ReactNode;
    variant?: "primary" | "secondary" | "outline";
    fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ type = "button", onClick, className = "", disabled = false, children, variant = "primary", fullWidth = false }) => {
    const baseClasses = "py-2 px-4 rounded font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50";
    const variantClasses = {
        primary: "bg-red-600 text-white hover:bg-red-700 shadow-md",
        secondary: "bg-white text-red-600 border border-red-600 hover:bg-red-50",
        outline: "bg-transparent text-red-600 border border-red-600 hover:bg-red-50",
    };
    const widthClass = fullWidth ? "w-full" : "";
    const disabledClass = disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer";

    return (
        <button type={type } onClick={ onClick } disabled={ disabled } className={`${ baseClasses } ${ variantClasses[variant] } ${ widthClass } ${ disabledClass } ${ className }`}>
            {children}
        </button>
    );
};