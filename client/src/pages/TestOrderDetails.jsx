import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';
import { FileText, Clock, CheckCircle, Package, Activity, Download } from 'lucide-react';

const TestOrderDetails = () => {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const res = await axiosInstance.get(`/api/v1/test-orders/${id}`);
                if (res.data.status === 'success') {
                    setOrder(res.data.data.order);
                }
            } catch (err) {
                console.error(err);
                setError('Failed to load order details');
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();
    }, [id]);

    if (loading) return <div className="text-center py-12">Loading...</div>;
    if (error) return <div className="text-center py-12 text-red-500">{error}</div>;
    if (!order) return null;

    const steps = [
        { id: 'BOOKED', label: 'Order Booked', icon: Package },
        { id: 'SAMPLE_COLLECTED', label: 'Sample Collected', icon: Activity },
        { id: 'IN_LAB', label: 'Processing in Lab', icon: Clock },
        { id: 'REPORT_READY', label: 'Report Ready', icon: FileText },
    ];

    const currentStepIndex = steps.findIndex(step => step.id === order.status);

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="mb-6">
                    <Link to="/tests" className="text-teal-600 hover:text-teal-700 font-medium text-sm">
                        &larr; Back to Tests
                    </Link>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-8">
                    <div className="px-6 py-6 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Order #{order._id.slice(-6).toUpperCase()}</h1>
                            <p className="text-sm text-gray-500 mt-1">
                                Placed on {new Date(order.createdAt).toLocaleDateString()}
                            </p>
                        </div>
                        <div className="text-right">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
                                ${order.status === 'REPORT_READY' ? 'bg-green-100 text-green-800' :
                                    order.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                                        'bg-blue-100 text-blue-800'}`}>
                                {order.status.replace('_', ' ')}
                            </span>
                        </div>
                    </div>

                    {/* Timeline */}
                    <div className="px-6 py-8">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center" aria-hidden="true">
                                <div className="w-full border-t border-gray-200"></div>
                            </div>
                            <div className="relative flex justify-between">
                                {steps.map((step, index) => {
                                    const Icon = step.icon;
                                    const isCompleted = index <= currentStepIndex || order.status === 'REPORT_READY'; // Simple logic
                                    const isCurrent = index === currentStepIndex;

                                    return (
                                        <div key={step.id} className="flex flex-col items-center">
                                            <div className={`relative flex items-center justify-center h-10 w-10 rounded-full border-2 bg-white
                                                ${isCompleted
                                                    ? 'border-teal-600 text-teal-600'
                                                    : 'border-gray-300 text-gray-400'}`}>
                                                <Icon className="h-5 w-5" />
                                            </div>
                                            <div className="mt-2 text-xs sm:text-sm font-medium text-gray-900 text-center max-w-[80px]">
                                                {step.label}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Details Grid */}
                    <div className="px-6 py-6 border-t border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Tests */}
                        <div>
                            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">Diagnostic Tests</h3>
                            <ul className="space-y-3">
                                {order.tests.map((item, idx) => (
                                    <li key={idx} className="flex justify-between items-start text-sm">
                                        <span className="text-gray-900 font-medium">{item.test.name}</span>
                                        <span className="text-gray-500">₹{item.price}</span>
                                    </li>
                                ))}
                                <li className="pt-3 border-t border-gray-100 flex justify-between font-bold text-gray-900">
                                    <span>Total</span>
                                    <span>₹{order.totalAmount}</span>
                                </li>
                            </ul>
                        </div>

                        {/* Info */}
                        <div>
                            <div className="mb-6">
                                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">Collection Address</h3>
                                <p className="text-sm text-gray-900">{order.collectionAddress.fullAddress}</p>
                                <p className="text-sm text-gray-900">{order.collectionAddress.city} - {order.collectionAddress.pincode}</p>
                            </div>

                            <div>
                                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">Scheduled For</h3>
                                <p className="text-sm text-gray-900 font-semibold">{new Date(order.preferredSlot.date).toDateString()}</p>
                                <p className="text-sm text-gray-900">{order.preferredSlot.timeRange}</p>
                            </div>
                        </div>
                    </div>

                    {/* Report Download */}
                    {order.status === 'REPORT_READY' && order.reportUrls && order.reportUrls.length > 0 && (
                        <div className="px-6 py-6 bg-green-50 border-t border-green-100">
                            <h3 className="text-lg font-medium text-green-900 mb-3 flex items-center">
                                <CheckCircle className="h-5 w-5 mr-2" />
                                Test Reports are Ready
                            </h3>
                            <div className="space-y-2">
                                {order.reportUrls.map((url, idx) => (
                                    <a
                                        key={idx}
                                        href={url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 shadow-sm"
                                    >
                                        <Download className="h-4 w-4 mr-2" />
                                        Download Report {order.reportUrls.length > 1 ? `#${idx + 1}` : ''}
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TestOrderDetails;
