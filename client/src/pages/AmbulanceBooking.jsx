import React, { useState } from 'react';
import axios from '../utils/axiosInstance';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { FaAmbulance, FaMapMarkerAlt, FaPhoneAlt, FaArrowLeft, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';

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
        <div className="min-h-screen bg-background-light flex flex-col font-body">
            <Navbar />
            <div className="flex-1 max-w-2xl mx-auto w-full p-4 md:p-8">
                <Button
                    variant="ghost"
                    onClick={() => navigate(-1)}
                    className="mb-6 pl-0 hover:bg-transparent hover:text-cta"
                >
                    <FaArrowLeft className="mr-2" /> Back
                </Button>

                <Card className="overflow-hidden shadow-2xl border-0 ring-4 ring-red-100 dark:ring-red-900/30">
                    <div className="bg-red-600 p-8 text-white text-center relative overflow-hidden">
                        <div className="relative z-10">
                            <div className="mx-auto bg-white/20 dark:bg-black/20 w-20 h-20 rounded-full flex items-center justify-center mb-4 backdrop-blur-sm shadow-inner">
                                <FaAmbulance className="text-4xl" />
                            </div>
                            <h1 className="text-3xl font-heading font-bold mb-2">Emergency Ambulance</h1>
                            <p className="text-red-100 font-medium">24/7 Rapid Response Team</p>
                        </div>
                        {/* Background blobs for visual interest */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl"></div>
                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full -ml-10 -mb-10 blur-2xl"></div>
                    </div>

                    <div className="p-8">
                        {!booking ? (
                            <>
                                <div className="mb-8 bg-red-50 dark:bg-red-900/10 border-l-4 border-red-500 p-4 rounded-r-xl">
                                    <div className="flex items-start gap-3">
                                        <FaExclamationTriangle className="text-red-600 mt-1 flex-shrink-0" />
                                        <p className="text-red-800 dark:text-red-200 text-sm font-medium leading-relaxed">
                                            For immediate life-threatening emergencies, consider calling your local emergency number (e.g., 911) directly.
                                        </p>
                                    </div>
                                </div>

                                <form onSubmit={handleBook} className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-bold text-text-primary mb-2 flex items-center gap-2">
                                            <FaMapMarkerAlt className="text-cta" /> Pickup Location
                                        </label>
                                        <textarea
                                            value={pickupLocation}
                                            onChange={(e) => setPickupLocation(e.target.value)}
                                            placeholder="Enter your current location..."
                                            className="w-full h-32 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 bg-gray-50/50 dark:bg-background-subtle text-text-primary transition-all outline-none resize-none"
                                            required
                                        />
                                    </div>

                                    <Input
                                        label="Contact Number"
                                        type="tel"
                                        value={contactNumber}
                                        onChange={(e) => setContactNumber(e.target.value)}
                                        placeholder="Emergency contact number..."
                                        required
                                        icon={FaPhoneAlt}
                                    />

                                    {error && <p className="text-red-600 text-center font-bold">{error}</p>}

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className={`w-full py-4 rounded-xl text-white font-heading font-bold text-xl shadow-lg transition-all transform hover:scale-[1.01] active:scale-[0.99] ${loading ? 'bg-red-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700 shadow-red-500/30'
                                            }`}
                                    >
                                        {loading ? 'Processing...' : 'BOOK AMBULANCE NOW'}
                                    </button>
                                </form>
                            </>
                        ) : (
                            <div className="text-center py-4">
                                <div className="mb-8">
                                    <div className="inline-block p-5 rounded-full bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400 mb-6 animate-bounce-slow shadow-sm">
                                        <FaCheckCircle className="text-5xl" />
                                    </div>
                                    <h2 className="text-3xl font-heading font-bold text-text-primary mb-2">Ambulance Dispatched!</h2>
                                    <p className="text-text-secondary">Help is on the way.</p>
                                </div>

                                <div className="bg-gray-50 dark:bg-gray-800/20 rounded-2xl p-6 mb-8 text-left space-y-4 border border-gray-100 dark:border-gray-700">
                                    <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-3">
                                        <span className="text-text-secondary text-sm">Ambulance ID</span>
                                        <span className="font-mono font-bold text-text-primary bg-white dark:bg-surface px-2 py-1 rounded border border-gray-200 dark:border-gray-700">{booking.ambulanceId}</span>
                                    </div>
                                    <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-3">
                                        <span className="text-text-secondary text-sm">Status</span>
                                        <Badge variant="primary" className="uppercase tracking-wider text-xs">{booking.status}</Badge>
                                    </div>
                                    <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-3">
                                        <span className="text-text-secondary text-sm">Estimated Arrival</span>
                                        <span className="font-bold text-text-primary text-lg">
                                            {Math.round((new Date(booking.estimatedArrival) - new Date()) / 60000)} mins
                                        </span>
                                    </div>
                                    <div className="pt-2">
                                        <span className="text-text-secondary text-xs block mb-1">Pickup Location</span>
                                        <p className="font-medium text-text-primary text-sm bg-white dark:bg-surface p-3 rounded-lg border border-gray-200 dark:border-gray-700">{booking.pickupLocation}</p>
                                    </div>
                                </div>

                                <Button
                                    onClick={() => navigate('/')}
                                    variant="outline"
                                    className="w-full"
                                >
                                    Return to Dashboard
                                </Button>
                            </div>
                        )}
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default AmbulanceBooking;
