import React from 'react';

const Button = ({
    children,
    variant = 'primary',
    size = 'md',
    className = '',
    disabled = false,
    ...props
}) => {
    const baseStyles = "inline-flex items-center justify-center font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto";

    const variants = {
        primary: "bg-cta text-white hover:bg-cta-hover focus:ring-cta text-white shadow-lg shadow-cta/30 hover:shadow-xl hover:-translate-y-px active:translate-y-0 transition-all duration-200 ease-out",
        secondary: "bg-transparent border-2 border-cta text-cta hover:bg-cta/5 focus:ring-cta",
        tertiary: "bg-transparent text-cta hover:text-cta-hover hover:underline focus:ring-cta",
        danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
        ghost: "bg-transparent text-text-secondary hover:bg-[#F7FAFC] dark:hover:bg-gray-800 hover:text-text-primary",
    };

    const sizes = {
        sm: "px-3 py-1.5 text-sm rounded-lg",
        md: "px-5 py-2.5 text-base rounded-xl",
        lg: "px-8 py-3.5 text-lg rounded-2xl",
        icon: "p-2 rounded-full",
    };

    const isLoadingProp = props.isLoading || false;

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className} ${isLoadingProp ? 'opacity-80 cursor-wait' : ''}`}
            disabled={disabled || isLoadingProp}
            {...props}
        >
            {isLoadingProp ? (
                <div className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Processing...</span>
                </div>
            ) : (
                children
            )}
        </button>
    );
};

export default Button;
