import React from 'react';

const Input = ({
    label,
    type = 'text',
    error,
    helperText,
    className = '',
    containerClassName = '',
    id,
    ...props
}) => {
    return (
        <div className={`flex flex-col space-y-1.5 ${containerClassName}`}>
            {label && (
                <label htmlFor={id} className="text-sm font-medium text-text-secondary block mb-1">
                    {label}
                </label>
            )}
            <input
                id={id}
                type={type}
                className={`
                    w-full px-4 py-2.5 
                    bg-surface border rounded-xl 
                    text-text-primary placeholder:text-text-muted/70
                    transition-colors duration-200
                    focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary
                    disabled:bg-gray-50 disabled:text-text-muted dark:disabled:bg-gray-800
                    ${error ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : 'border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600'}
                    ${className}
                `}
                {...props}
            />
            {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
            {helperText && !error && <p className="text-sm text-text-muted mt-1">{helperText}</p>}
        </div>
    );
};

export default Input;
