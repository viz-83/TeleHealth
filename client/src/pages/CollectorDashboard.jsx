import React, { useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { ClipboardList, MapPin, Phone, CheckCircle, Clock } from 'lucide-react';

const CollectorDashboard = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAssignedOrders();
    }, []);

    const fetchAssignedOrders = async () => {
        try {
            const res = await axiosInstance.get('/api/v1/test-orders/assigned');
            if (res.data.status === 'success') {
                setOrders(res.data.data.orders);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const markCollected = async (orderId) => {
        if (!window.confirm('Confirm that you have collected the sample?')) return;

        try {
            const res = await axiosInstance.patch(`/api/v1/test-orders/${orderId}/status`, {
                status: 'SAMPLE_COLLECTED'
            });

            if (res.data.status === 'success') {
                // Refresh or update local state
                setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status: 'SAMPLE_COLLECTED' } : o));
            }
        } catch (error) {
            alert('Failed to update status');
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                        <ClipboardList className="h-8 w-8 mr-3 text-teal-600" />
                        Field Worker Dashboard
                    </h1>
                    <span className="bg-teal-100 text-teal-800 px-3 py-1 rounded-full text-sm font-medium">
                        Active Tasks: {orders.filter(o => o.status === 'BOOKED').length}
                    </span>
                </div>

                {loading ? (
                    <div className="text-center py-12">Loading tasks...</div>
                ) : orders.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                        <p className="text-gray-500 text-lg">No assigned collections found.</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order) => (
                            <div key={order._id} className="bg-white rounded-lg shadow-sm border-l-4 border-teal-500 overflow-hidden">
                                <div className="p-6">
                                    <div className="flex flex-col md:flex-row justify-betweenStart gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-center mb-2">
                                                <h3 className="text-lg font-semibold text-gray-900 mr-3">
                                                    {order.patient?.name || 'Unknown Patient'}
                                                </h3>
                                                <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase
                                                    ${order.status === 'BOOKED' ? 'bg-yellow-100 text-yellow-800' :
                                                        order.status === 'SAMPLE_COLLECTED' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                                                    {order.status.replace('_', ' ')}
                                                </span>
                                            </div>

                                            <div className="space-y-1 text-sm text-gray-600 mb-4">
                                                <p className="flex items-center">
                                                    <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                                                    {order.collectionAddress.fullAddress}, {order.collectionAddress.city} - {order.collectionAddress.pincode}
                                                </p>
                                                <p className="flex items-center">
                                                    <Clock className="h-4 w-4 mr-2 text-gray-400" />
                                                    <span className="font-semibold mr-1">Scheduled:</span>
                                                    {new Date(order.preferredSlot.date).toDateString()} @ {order.preferredSlot.timeRange}
                                                </p>
                                                {/* In real app, we would have patient phone accessible here if populated */}
                                            </div>

                                            <div className="bg-gray-50 p-3 rounded-md">
                                                <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Tests to Collect</p>
                                                <ul className="list-disc list-inside text-sm text-gray-800">
                                                    {order.tests.map((t, i) => (
                                                        <li key={i}>{t.test.name} ({t.test.sampleType})</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>

                                        <div className="flex md:flex-col justify-end items-end gap-3 mt-4 md:mt-0">
                                            {order.status === 'BOOKED' ? (
                                                <button
                                                    onClick={() => markCollected(order._id)}
                                                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                                                >
                                                    <CheckCircle className="h-4 w-4 mr-2" />
                                                    Mark Collected
                                                </button>
                                            ) : (
                                                <button disabled className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-400 bg-gray-100 cursor-not-allowed">
                                                    <CheckCircle className="h-4 w-4 mr-2" />
                                                    Completed
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CollectorDashboard;
