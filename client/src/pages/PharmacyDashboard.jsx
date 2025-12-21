import { useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { Package, Truck, CheckCircle, AlertCircle, Clock, Search } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { format } from 'date-fns';

const PharmacyDashboard = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState('ALL');

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.get('/api/v1/medicine-orders');
            setOrders(response.data.data.orders);
        } catch (error) {
            console.error('Error fetching orders:', error);
            toast.error('Failed to load orders');
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (orderId, newStatus) => {
        try {
            await axiosInstance.patch(`/api/v1/medicine-orders/${orderId}/status`, {
                status: newStatus
            });
            toast.success(`Order updated to ${newStatus}`);
            fetchOrders(); // Refresh
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    const filteredOrders = filterStatus === 'ALL'
        ? orders
        : orders.filter(order => order.status === filterStatus);

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Pharmacy Dashboard</h1>
                        <p className="text-gray-500">Manage prescription verification and dispatch</p>
                    </div>
                    <button
                        onClick={fetchOrders}
                        className="bg-white px-4 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50"
                    >
                        Refresh
                    </button>
                </div>

                {/* Status Filters */}
                <div className="flex gap-2 overflow-x-auto pb-4 mb-4">
                    {['ALL', 'PRESCRIPTION_PENDING', 'PLACED', 'VERIFIED', 'PACKED', 'OUT_FOR_DELIVERY', 'DELIVERED'].map(status => (
                        <button
                            key={status}
                            onClick={() => setFilterStatus(status)}
                            className={`px-4 py-2 rounded-lg whitespace-nowrap text-sm font-bold transition-colors ${filterStatus === status
                                ? 'bg-teal-600 text-white shadow-md'
                                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                                }`}
                        >
                            {status.replace(/_/g, ' ')}
                        </button>
                    ))}
                </div>

                {/* Orders Grid */}
                {loading ? (
                    <div className="text-center py-20 text-gray-500">Loading orders...</div>
                ) : (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
                                    <tr>
                                        <th className="px-6 py-4">Order ID / Date</th>
                                        <th className="px-6 py-4">Customer</th>
                                        <th className="px-6 py-4">Reference</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4">Items</th>
                                        <th className="px-6 py-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {filteredOrders.map((order) => (
                                        <tr key={order._id} className="hover:bg-gray-50 transition">
                                            <td className="px-6 py-4">
                                                <span className="font-mono text-xs font-bold bg-gray-100 px-2 py-1 rounded">#{order._id.slice(-6)}</span>
                                                <p className="text-xs text-gray-400 mt-1">{format(new Date(order.createdAt), 'MMM dd, HH:mm')}</p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="font-medium text-gray-900">{order.patient?.name || 'Unknown'}</p>
                                                <p className="text-xs text-gray-500">{order.deliveryAddress.city}</p>
                                            </td>
                                            <td className="px-6 py-4">
                                                {order.prescription ? (
                                                    <a href="#" className="text-blue-600 hover:underline text-sm flex items-center gap-1">
                                                        <Paperclip className="h-3 w-3" /> View Rx
                                                    </a>
                                                ) : (
                                                    <span className="text-gray-400 text-xs">No Rx</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded-full text-xs font-bold ${order.status === 'PRESCRIPTION_PENDING' ? 'bg-amber-100 text-amber-700' :
                                                    order.status === 'VERIFIED' ? 'bg-blue-100 text-blue-700' :
                                                        order.status === 'PACKED' ? 'bg-purple-100 text-purple-700' :
                                                            order.status === 'DELIVERED' ? 'bg-green-100 text-green-700' :
                                                                'bg-gray-100 text-gray-600'
                                                    }`}>
                                                    {order.status.replace(/_/g, ' ')}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="text-sm text-gray-600 line-clamp-1">
                                                    {order.medicines.map(m => `${m.quantity}x ${m.name}`).join(', ')}
                                                </p>
                                                <p className="text-xs text-gray-400 font-bold mt-1">Total: ₹{order.totalAmount}</p>
                                            </td>
                                            <td className="px-6 py-4 text-right space-x-2">
                                                {order.status === 'PRESCRIPTION_PENDING' && (
                                                    <button
                                                        onClick={() => updateStatus(order._id, 'VERIFIED')}
                                                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition"
                                                    >
                                                        Verify
                                                    </button>
                                                )}
                                                {order.status === 'VERIFIED' && (
                                                    <button
                                                        onClick={() => updateStatus(order._id, 'PACKED')}
                                                        className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition"
                                                    >
                                                        Mark Packed
                                                    </button>
                                                )}
                                                {(order.status === 'PLACED') && (
                                                    <button
                                                        onClick={() => updateStatus(order._id, 'PACKED')}
                                                        className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition"
                                                    >
                                                        Mark Packed
                                                    </button>
                                                )}
                                                {order.status === 'PACKED' && (
                                                    <button
                                                        onClick={() => updateStatus(order._id, 'OUT_FOR_DELIVERY')}
                                                        className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition"
                                                    >
                                                        Dispatch
                                                    </button>
                                                )}
                                                {order.status === 'OUT_FOR_DELIVERY' && (
                                                    <button
                                                        onClick={() => updateStatus(order._id, 'DELIVERED')}
                                                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition"
                                                    >
                                                        Complete
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                    {filteredOrders.length === 0 && (
                                        <tr>
                                            <td colSpan="6" className="text-center py-12 text-gray-400">
                                                No orders found in this status.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

// Icon helper
const Paperclip = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" /></svg>
);

export default PharmacyDashboard;
