import { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

const MedicineCartContext = createContext();

export const useMedicineCart = () => useContext(MedicineCartContext);

export const MedicineCartProvider = ({ children }) => {
    // 1. Initialize State
    const [cart, setCart] = useState(() => {
        const savedCart = sessionStorage.getItem('medicineCart');
        return savedCart ? JSON.parse(savedCart) : [];
    });

    const [cartTotal, setCartTotal] = useState(0);

    // 2. Persist to SessionStorage
    useEffect(() => {
        sessionStorage.setItem('medicineCart', JSON.stringify(cart));

        // Calculate total
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        setCartTotal(total);
    }, [cart]);

    // 3. Actions
    const addToCart = (medicine) => {
        setCart(prevCart => {
            const existingItem = prevCart.find(item => item._id === medicine._id);

            if (existingItem) {
                toast.success(`Increased quantity for ${medicine.name}`);
                return prevCart.map(item =>
                    item._id === medicine._id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            } else {
                toast.success(`${medicine.name} added to cart!`);
                return [...prevCart, { ...medicine, quantity: 1 }];
            }
        });
    };

    const removeFromCart = (medicineId) => {
        setCart(prevCart => prevCart.filter(item => item._id !== medicineId));
        toast.success("Removed from cart");
    };

    const updateQuantity = (medicineId, newQuantity) => {
        if (newQuantity < 1) {
            removeFromCart(medicineId);
            return;
        }
        setCart(prevCart =>
            prevCart.map(item =>
                item._id === medicineId
                    ? { ...item, quantity: newQuantity }
                    : item
            )
        );
    };

    const clearCart = () => {
        setCart([]);
        sessionStorage.removeItem('medicineCart');
    };

    // Check if any item in cart requires prescription
    const requiresPrescription = cart.some(item => item.prescriptionRequired);

    return (
        <MedicineCartContext.Provider value={{
            cart,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            cartTotal,
            requiresPrescription
        }}>
            {children}
        </MedicineCartContext.Provider>
    );
};
