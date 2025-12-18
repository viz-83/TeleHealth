import React, { useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';

const AmbulanceBooking = () => {
    const navigate = useNavigate();
    const [pickupLocation, setPickupLocation] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    const [loading, setLoading] = useState(false);
    const [booking, setBooking] = useState(null);
    const [error, setError] = useState('');

    const handleBook = async (e) => {
        e.preventDefault();
        if (!pickupLocation || !contactNumber) {
            setError('Please fill in all fields.');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const token = localStorage.getItem('token');
            const { data } = await axios.post('http://localhost:5000/api/v1/ambulance/book',
                { pickupLocation, contactNumber },
                {
                    headers: { Authorization: `Bearer ${token}` },
                    withCredentials: true
                }
            );

            if (data.status === 'success') {
                setBooking(data.data.booking);
            }
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Failed to book ambulance. Please try again or call emergency services directly.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="max-w-2xl mx-auto px-4 py-8">
                <button
                    onClick={() => navigate(-1)}
                    className="mb-6 text-blue-600 hover:text-blue-800 font-medium"
                >
                    &larr; Back
                </button>

                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="bg-red-600 p-6 text-white text-center">
                        <div className="mx-auto bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mb-4 backdrop-blur-sm">
                            <span className="text-3xl">🚑</span>
                        </div>
                        <h1 className="text-3xl font-bold mb-2">Emergency Ambulance</h1>
                        <p className="text-red-100">24/7 Rapid Response Team</p>
                    </div>

                    <div className="p-8">
                        {!booking ? (
                            <>
                                <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4">
                                    <p className="text-red-700 font-medium">
                                        For immediate life-threatening emergencies, consider calling your local emergency number directly.
                                    </p>
                                </div>

                                <form onSubmit={handleBook} className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Pickup Location / Address</label>
                                        <textarea
                                            value={pickupLocation}
                                            onChange={(e) => setPickupLocation(e.target.value)}
                                            placeholder="Enter your current location..."
                                            className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition resize-none"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
                                        <input
                                            type="tel"
                                            value={contactNumber}
                                            onChange={(e) => setContactNumber(e.target.value)}
                                            placeholder="Emergency contact number..."
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition"
                                            required
                                        />
                                    </div>

                                    {error && <p className="text-red-500 text-center">{error}</p>}

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className={`w-full py-4 rounded-lg text-white font-bold text-xl shadow-lg transition transform hover:scale-[1.02] active:scale-[0.98] ${loading ? 'bg-red-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'
                                            }`}
                                    >
                                        {loading ? 'Processing...' : 'BOOK AMBULANCE NOW'}
                                    </button>
                                </form>
                            </>
                        ) : (
                            <div className="text-center py-8">
                                <div className="mb-6">
                                    <div className="inline-block p-4 rounded-full bg-green-100 text-green-600 mb-4 animate-pulse">
                                        <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Ambulance Dispatched!</h2>
                                    <p className="text-gray-600">Help is on the way.</p>
                                </div>

                                <div className="bg-gray-50 rounded-lg p-6 mb-6 text-left space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Ambulance ID:</span>
                                        <span className="font-semibold text-gray-800">{booking.ambulanceId}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Status:</span>
                                        <span className="font-bold text-blue-600 uppercase">{booking.status}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Estimated Arrival:</span>
                                        <span className="font-bold text-gray-800">
                                            {Math.round((new Date(booking.estimatedArrival) - new Date()) / 60000)} mins
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Pickup:</span>
                                        <span className="font-medium text-gray-800 truncate max-w-[200px]">{booking.pickupLocation}</span>
                                    </div>
                                </div>

                                <button
                                    onClick={() => navigate('/dashboard')}
                                    className="px-6 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 font-semibold"
                                >
                                    Return to Dashboard
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AmbulanceBooking;
