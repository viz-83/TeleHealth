import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

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
        // Check for duplicates using current state
        const isDuplicate = cart.some(item => item._id === test._id);

        if (isDuplicate) {
            toast.error("Item already in cart");
            return;
        }

        setCart(prevCart => [...prevCart, test]);
        toast.success("Test added to cart");
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
