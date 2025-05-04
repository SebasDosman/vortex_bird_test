import React from "react";


interface InputProps {
    id: string;
    name: string;
    type?: string;
    label?: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    required?: boolean;
    error?: string;
    className?: string;
}

export const Input: React.FC<InputProps> = ({ id, name, type = "text", label, value, onChange, placeholder, required = false, error, className = "" }) => {
    return (
        <div className={`mb-4 ${className}`}>
            {   
                label && (
                    <label htmlFor={ id } className="block text-sm font-medium text-gray-700 mb-1">
                        { label} { required && <span className="text-red-600">*</span> }
                    </label>
                )
            }
        <input id={ id } name={ name } type={ type } value={ value } onChange={ onChange } placeholder={ placeholder } required={ required } 
            className={ `w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 
            ${
                error ? "border-red-500" : "border-gray-300"
            }` }
        />
            { error && <p className="mt-1 text-sm text-red-600">{error}</p> }
        </div>
    );
};