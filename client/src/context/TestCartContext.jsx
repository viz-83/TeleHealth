import React, { createContext, useContext, useState, useEffect } from 'react';

const TestCartContext = createContext();

export const useTestCart = () => {
    return useContext(TestCartContext);
};

export const TestCartProvider = ({ children }) => {
    const [cart, setCart] = useState(() => {
        try {
            const savedCart = sessionStorage.getItem('testCart');
            return savedCart ? JSON.parse(savedCart) : [];
        } catch (error) {
            console.error("Failed to load cart from storage", error);
            return [];
        }
    });

    useEffect(() => {
        sessionStorage.setItem('testCart', JSON.stringify(cart));
    }, [cart]);

    const addToCart = (test) => {
        setCart(prevCart => {
            // Prevent duplicates
            if (prevCart.find(item => item._id === test._id)) {
                return prevCart;
            }
            return [...prevCart, test];
        });
    };

    const removeFromCart = (testId) => {
        setCart(prevCart => prevCart.filter(item => item._id !== testId));
    };

    const clearCart = () => {
        setCart([]);
    };

    const cartTotal = cart.reduce((total, item) => total + item.price, 0);

    const value = {
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        cartTotal
    };

    return (
        <TestCartContext.Provider value={value}>
            {children}
        </TestCartContext.Provider>
    );
};
