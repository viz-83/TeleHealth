import React, { useState } from 'react';
import { useTestCart } from '../context/TestCartContext';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';
import { Trash2, Calendar, MapPin, CreditCard, ArrowRight, AlertCircle, ShoppingCart } from 'lucide-react';

const TestCart = () => {
    const { cart, removeFromCart, cartTotal, clearCart } = useTestCart();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [details, setDetails] = useState({
        fullAddress: '',
        city: '',
        pincode: '',
        date: '',
        timeRange: ''
    });

    const handleChange = (e) => {
        setDetails({ ...details, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const payload = {
                testIds: cart.map(item => item._id),
                collectionAddress: {
                    fullAddress: details.fullAddress,
                    city: details.city,
                    pincode: details.pincode
                },
                preferredSlot: {
                    date: details.date,
                    timeRange: details.timeRange
                }
            };

            const res = await axiosInstance.post('/api/v1/test-orders', payload);

            if (res.data.status === 'success') {
                clearCart();
                navigate(`/tests/orders/${res.data.data.order._id}`);
            }
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Failed to place order. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (cart.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="text-center max-w-md">
                    <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                        <div className="h-16 w-16 bg-teal-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <ShoppingCart className="h-8 w-8 text-teal-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
                        <p className="text-gray-500 mb-6">Looks like you haven't added any tests yet.</p>
                        <button
                            onClick={() => navigate('/tests')}
                            className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700"
                        >
                            Browse Tests
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Calculate simple generic tomorrow date for min date attribute
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const minDate = tomorrow.toISOString().split('T')[0];

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Order Summary & Form */}
                    <div className="md:col-span-2 space-y-8">

                        {/* Selected Tests */}
                        <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
                            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                                <h3 className="text-lg font-medium text-gray-900">Selected Tests ({cart.length})</h3>
                            </div>
                            <ul className="divide-y divide-gray-200">
                                {cart.map((item) => (
                                    <li key={item._id} className="p-6 flex items-center justify-between">
                                        <div className="flex-1">
                                            <h4 className="text-base font-medium text-gray-900">{item.name}</h4>
                                            <p className="text-sm text-gray-500 mt-1">{item.category} • {item.sampleType}</p>
                                        </div>
                                        <div className="flex items-center">
                                            <span className="text-base font-semibold text-gray-900 mr-6">₹{item.price}</span>
                                            <button
                                                onClick={() => removeFromCart(item._id)}
                                                className="text-gray-400 hover:text-red-500 transition-colors"
                                            >
                                                <Trash2 className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
                                <span className="font-medium text-gray-900">Total Amount</span>
                                <span className="text-xl font-bold text-teal-700">₹{cartTotal}</span>
                            </div>
                        </div>

                        {/* Collection Details Form */}
                        <form id="checkout-form" onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                                <h3 className="text-lg font-medium text-gray-900 flex items-center">
                                    <MapPin className="h-5 w-5 mr-2 text-teal-600" />
                                    Collection Details
                                </h3>
                            </div>
                            <div className="p-6 gap-6 grid grid-cols-1">
                                <div>
                                    <label htmlFor="fullAddress" className="block text-sm font-medium text-gray-700">Full Address</label>
                                    <textarea
                                        required
                                        name="fullAddress"
                                        rows={3}
                                        value={details.fullAddress}
                                        onChange={handleChange}
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                                        placeholder="House No, Street, Landmark..."
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="city" className="block text-sm font-medium text-gray-700">City</label>
                                        <input
                                            type="text"
                                            name="city"
                                            required
                                            value={details.city}
                                            onChange={handleChange}
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="pincode" className="block text-sm font-medium text-gray-700">Pincode</label>
                                        <input
                                            type="text"
                                            name="pincode"
                                            required
                                            pattern="[0-9]{6}"
                                            value={details.pincode}
                                            onChange={handleChange}
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                                        />
                                    </div>
                                </div>

                                <div className="border-t border-gray-100 pt-6 mt-2">
                                    <h4 className="text-base font-medium text-gray-900 mb-4 flex items-center">
                                        <Calendar className="h-5 w-5 mr-2 text-teal-600" />
                                        Preferred Slot
                                    </h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date</label>
                                            <input
                                                type="date"
                                                name="date"
                                                required
                                                min={minDate}
                                                value={details.date}
                                                onChange={handleChange}
                                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="timeRange" className="block text-sm font-medium text-gray-700">Time</label>
                                            <select
                                                name="timeRange"
                                                required
                                                value={details.timeRange}
                                                onChange={handleChange}
                                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                                            >
                                                <option value="">Select a slot</option>
                                                <option value="07:00 AM - 09:00 AM">07:00 AM - 09:00 AM</option>
                                                <option value="09:00 AM - 11:00 AM">09:00 AM - 11:00 AM</option>
                                                <option value="11:00 AM - 01:00 PM">11:00 AM - 01:00 PM</option>
                                                <option value="02:00 PM - 04:00 PM">02:00 PM - 04:00 PM</option>
                                                <option value="04:00 PM - 06:00 PM">04:00 PM - 06:00 PM</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>

                    {/* Payment & CTA */}
                    <div className="md:col-span-1">
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 sticky top-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Payment Details</h3>
                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between text-gray-600 text-sm">
                                    <span>Item Total</span>
                                    <span>₹{cartTotal}</span>
                                </div>
                                <div className="flex justify-between text-gray-600 text-sm">
                                    <span>Home Collection</span>
                                    <span className="text-green-600 font-medium">FREE</span>
                                </div>
                                <div className="border-t border-gray-200 pt-3 flex justify-between font-bold text-gray-900 text-lg">
                                    <span>Total Pay</span>
                                    <span>₹{cartTotal}</span>
                                </div>
                            </div>

                            {error && (
                                <div className="mb-4 bg-red-50 border border-red-200 rounded-md p-3 flex items-start">
                                    <AlertCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0" />
                                    <p className="text-sm text-red-700">{error}</p>
                                </div>
                            )}

                            <div className="bg-blue-50 border border-blue-100 rounded-md p-3 mb-6">
                                <p className="text-xs text-blue-700 flex items-start">
                                    <AlertCircle className="h-4 w-4 mr-1 flex-shrink-0" />
                                    Payment will be collected at home or you can pay online after booking.
                                </p>
                            </div>

                            <button
                                type="submit"
                                form="checkout-form"
                                disabled={loading}
                                className="w-full flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:bg-gray-400 cursor-pointer"
                            >
                                {loading ? 'Processing...' : (
                                    <>
                                        Confirm Booking
                                        <ArrowRight className="ml-2 h-5 w-5" />
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TestCart;

