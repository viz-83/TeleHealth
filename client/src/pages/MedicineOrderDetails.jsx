import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';
import { Package, Truck, CheckCircle, Clock } from 'lucide-react';
import { format } from 'date-fns';

const MedicineOrderDetails = () => {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const response = await axiosInstance.get(`/api/v1/medicine-orders/${id}`);
                setOrder(response.data.data.order);
            } catch (error) {
                console.error('Error fetching order:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchOrder();
    }, [id]);

    if (loading) return <div className="p-8 text-center text-gray-500">Loading order details...</div>;
    if (!order) return <div className="p-8 text-center text-red-500">Order not found</div>;

    // Status Timeline Logic
    const steps = [
        { status: 'PLACED', label: 'Order Placed', icon: Clock },
        { status: 'VERIFIED', label: 'Verified', icon: CheckCircle },
        { status: 'PACKED', label: 'Packed', icon: Package },
        { status: 'OUT_FOR_DELIVERY', label: 'Out for Delivery', icon: Truck },
        { status: 'DELIVERED', label: 'Delivered', icon: Home }
    ];

    // Handle PRESCRIPTION_PENDING special case
    const currentStepIndex = order.status === 'PRESCRIPTION_PENDING'
        ? -1
        : steps.findIndex(s => s.status === order.status);

    const isCancelled = order.status === 'CANCELLED';

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8">
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-2xl p-6 shadow-sm mb-6 border border-gray-100">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Order #{order._id.slice(-6)}</h1>
                            <p className="text-gray-500 text-sm">Placed on {format(new Date(order.createdAt), 'PPP')}</p>
                        </div>
                        <span className={`px-4 py-2 rounded-full text-sm font-bold ${order.status === 'DELIVERED' ? 'bg-green-100 text-green-700' :
                            order.status === 'CANCELLED' ? 'bg-red-100 text-red-700' :
                                order.status === 'PRESCRIPTION_PENDING' ? 'bg-amber-100 text-amber-700' :
                                    'bg-blue-100 text-blue-700'
                            }`}>
                            {order.status.replace(/_/g, ' ')}
                        </span>
                    </div>

                    {/* Timeline */}
                    {!isCancelled && (
                        <div className="mt-8 relative">
                            <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -z-0 -translate-y-1/2 rounded-full"></div>
                            <div className="absolute top-1/2 left-0 h-1 bg-teal-500 -z-0 -translate-y-1/2 rounded-full transition-all duration-1000"
                                style={{ width: `${Math.max(0, (currentStepIndex / (steps.length - 1)) * 100)}%` }}></div>

                            <div className="flex justify-between relative z-10">
                                {steps.map((step, index) => {
                                    const isCompleted = index <= currentStepIndex;
                                    const Icon = step.icon;

                                    return (
                                        <div key={step.status} className="flex flex-col items-center">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-4 transition-colors ${isCompleted
                                                ? 'bg-teal-600 border-teal-100 text-white'
                                                : 'bg-white border-gray-200 text-gray-400'
                                                }`}>
                                                <Icon className="h-4 w-4" />
                                            </div>
                                            <span className={`text-xs font-bold mt-2 ${isCompleted ? 'text-teal-700' : 'text-gray-400'}`}>
                                                {step.label}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {order.status === 'PRESCRIPTION_PENDING' && (
                        <div className="mt-6 bg-amber-50 border border-amber-200 rounded-lg p-4 text-center">
                            <p className="text-amber-800 font-medium tracking-wide">
                                ⏳ Your order is pending verification by our pharmacy team.
                            </p>
                            <p className="text-amber-600 text-sm mt-1">This usually takes 10-30 minutes.</p>
                        </div>
                    )}
                </div>

                {/* Items & Address Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Medicines List */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                        <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <Package className="h-5 w-5 text-gray-500" />
                            Items Ordered
                        </h2>
                        <div className="space-y-4">
                            {order.medicines.map((item) => (
                                <div key={item._id} className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
                                    <div>
                                        <p className="font-medium text-gray-900">{item.name}</p>
                                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                    </div>
                                    <p className="font-bold text-gray-900">₹{item.priceAtPurchase * item.quantity}</p>
                                </div>
                            ))}
                            <div className="flex justify-between pt-4 border-t border-gray-100 text-lg font-bold">
                                <span>Total Paid</span>
                                <span>₹{order.totalAmount}</span>
                            </div>
                        </div>
                    </div>

                    {/* Delivery Address */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 h-fit">
                        <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <Home className="h-5 w-5 text-gray-500" />
                            Delivery Location
                        </h2>
                        <div className="text-gray-600 leading-relaxed">
                            <p>{order.deliveryAddress.fullAddress}</p>
                            <p>{order.deliveryAddress.city}</p>
                            <p className="font-medium text-gray-900">PIN: {order.deliveryAddress.pincode}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Icon helper
const Home = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" /><path d="M3 6h18" /><path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
);

export default MedicineOrderDetails;
