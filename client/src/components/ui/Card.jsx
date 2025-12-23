import React from 'react';

const Card = ({ children, className = '', ...props }) => {
    return (
        <div
            className={`bg-surface rounded-2xl shadow-soft border border-gray-100/50 dark:border-gray-700/50 overflow-hidden ${className}`}
            {...props}
        >
            {children}
        </div>
    );
};

export default Card;
