import { useState } from 'react';
import { useMedicineCart } from '../context/MedicineCartContext';
import { useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, Home, ArrowRight, AlertTriangle } from 'lucide-react';
import axiosInstance from '../utils/axiosInstance';
import toast from 'react-hot-toast';

const MedicineCart = () => {
    const { cart, updateQuantity, removeFromCart, cartTotal, clearCart, requiresPrescription } = useMedicineCart();
    const navigate = useNavigate();
    const [submitting, setSubmitting] = useState(false);

    // Simple address state for now. Ideally fetch from user profile.
    const [address, setAddress] = useState({
        fullAddress: '',
        city: '',
        pincode: ''
    });

    const handlePlaceOrder = async () => {
        if (!address.fullAddress || !address.city || !address.pincode) {
            toast.error('Please fill in complete delivery address details');
            return;
        }

        try {
            setSubmitting(true);

            const orderData = {
                medicineItems: cart.map(item => ({
                    medicineId: item._id,
                    quantity: item.quantity
                })),
                deliveryAddress: address,
                prescriptionId: null // TODO: Implement file upload logic separately if needed
            };

            const response = await axiosInstance.post('/api/v1/medicine-orders', orderData);

            toast.success('Order placed successfully!');
            clearCart();
            navigate(`/medicines/orders/${response.data.data.order._id}`);

        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to place order');
        } finally {
            setSubmitting(false);
        }
    };

    if (cart.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
                <div className="bg-white p-8 rounded-2xl shadow-sm text-center max-w-md w-full">
                    <div className="bg-teal-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <ShoppingBag className="h-10 w-10 text-teal-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
                    <p className="text-gray-500 mb-8">Looks like you haven't added any medicines yet.</p>
                    <button
                        onClick={() => navigate('/medicines')}
                        className="w-full bg-teal-600 text-white py-3 rounded-xl font-bold hover:bg-teal-700 transition"
                    >
                        Browse Medicines
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4 pb-20 pt-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <span className="bg-teal-600 text-white text-sm px-2 py-1 rounded-md">
                        {cart.length} Items
                    </span>
                    Your Cart
                </h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-4">
                        {requiresPrescription && (
                            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
                                <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                                <div>
                                    <h3 className="font-bold text-amber-800 text-sm">Prescription Required</h3>
                                    <p className="text-sm text-amber-700 mt-1">
                                        Some items in your cart require a valid prescription. Your order will be pending verification by our pharmacy team.
                                    </p>
                                </div>
                            </div>
                        )}

                        {cart.map((item) => (
                            <div key={item._id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex gap-4">
                                <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-lg bg-gray-100" />

                                <div className="flex-grow">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-bold text-gray-900">{item.name}</h3>
                                            <p className="text-sm text-gray-500">{item.brand} • {item.strength}</p>
                                        </div>
                                        <p className="font-bold text-gray-900">₹{item.price * item.quantity}</p>
                                    </div>

                                    <div className="flex justify-between items-center mt-4">
                                        <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-1">
                                            <button
                                                onClick={() => updateQuantity(item._id, item.quantity - 1)}
                                                className="p-1 hover:bg-white rounded-md transition shadow-sm"
                                            >
                                                <Minus className="h-3 w-3 text-gray-600" />
                                            </button>
                                            <span className="text-sm font-medium w-4 text-center">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item._id, item.quantity + 1)}
                                                className="p-1 hover:bg-white rounded-md transition shadow-sm"
                                            >
                                                <Plus className="h-3 w-3 text-gray-600" />
                                            </button>
                                        </div>

                                        <button
                                            onClick={() => removeFromCart(item._id)}
                                            className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Summary & Checkout */}
                    <div className="space-y-6">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-4">
                            <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <Home className="h-5 w-5 text-teal-600" />
                                Delivery Address
                            </h2>
                            <div className="space-y-3 mb-6">
                                <input
                                    type="text"
                                    placeholder="Street Address / Flat No."
                                    className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none text-sm"
                                    value={address.fullAddress}
                                    onChange={(e) => setAddress({ ...address, fullAddress: e.target.value })}
                                />
                                <div className="grid grid-cols-2 gap-3">
                                    <input
                                        type="text"
                                        placeholder="City"
                                        className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none text-sm"
                                        value={address.city}
                                        onChange={(e) => setAddress({ ...address, city: e.target.value })}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Pincode"
                                        className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none text-sm"
                                        value={address.pincode}
                                        onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="border-t border-gray-100 pt-4 space-y-2 mb-6">
                                <div className="flex justify-between text-gray-500 text-sm">
                                    <span>Item Total</span>
                                    <span>₹{cartTotal}</span>
                                </div>
                                <div className="flex justify-between text-gray-500 text-sm">
                                    <span>Delivery Fee</span>
                                    <span className="text-teal-600 font-medium">Free</span>
                                </div>
                                <div className="flex justify-between text-lg font-bold text-gray-900 pt-2">
                                    <span>To Pay</span>
                                    <span>₹{cartTotal}</span>
                                </div>
                            </div>

                            <button
                                onClick={handlePlaceOrder}
                                disabled={submitting}
                                className="w-full bg-teal-600 text-white py-3.5 rounded-xl font-bold hover:bg-teal-700 transition shadow-lg shadow-teal-200 flex items-center justify-center gap-2 disabled:opacity-70"
                            >
                                {submitting ? 'Processing...' : 'Place Order'}
                                {!submitting && <ArrowRight className="h-5 w-5" />}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Start Icon helper
const ShoppingBag = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" /><path d="M3 6h18" /><path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
);

export default MedicineCart;
