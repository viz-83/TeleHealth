import React from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Welcome, {user?.name}</h1>
                <button onClick={handleLogout} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">Logout</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
                    <div className="space-y-4">
                        <button onClick={() => navigate('/video')} className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Start Video Call</button>
                        <button onClick={() => navigate('/chat')} className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">Open Chat</button>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-xl font-bold mb-4">Messages</h2>
                    <p className="text-gray-600">No new messages.</p>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
