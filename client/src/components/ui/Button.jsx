import React from 'react';

const Button = ({
    children,
    variant = 'primary',
    size = 'md',
    className = '',
    disabled = false,
    ...props
}) => {
    const baseStyles = "inline-flex items-center justify-center font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

    const variants = {
        primary: "bg-cta text-white hover:bg-cta-hover focus:ring-cta text-white shadow-lg shadow-cta/30",
        secondary: "bg-transparent border-2 border-cta text-cta hover:bg-cta/5 focus:ring-cta",
        tertiary: "bg-transparent text-cta hover:text-cta-hover hover:underline focus:ring-cta",
        danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
        ghost: "bg-transparent text-text-secondary hover:!bg-gray-100 dark:hover:!bg-gray-800 hover:text-text-primary",
    };

    const sizes = {
        sm: "px-3 py-1.5 text-sm rounded-lg",
        md: "px-5 py-2.5 text-base rounded-xl",
        lg: "px-8 py-3.5 text-lg rounded-2xl",
        icon: "p-2 rounded-full",
    };

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
            disabled={disabled}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;
