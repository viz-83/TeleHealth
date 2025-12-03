import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <nav className="bg-white shadow-md p-4 flex justify-between items-center">
            <div className="flex items-center space-x-4">
                <div className="text-2xl font-bold text-blue-600">TeleHealth</div>
                <div className="space-x-4">
                    <Link to="/dashboard" className="text-gray-700 hover:text-blue-600">Home</Link>
                    <Link to="/find-doctors" className="text-gray-700 hover:text-blue-600">Find Doctors</Link>
                    <Link to="/my-appointments" className="text-gray-700 hover:text-blue-600">My Appointments</Link>
                    <Link to="/doctor/dashboard" className="text-gray-700 hover:text-blue-600">Doctor Dashboard</Link>
                </div>
            </div>
            <div className="flex items-center space-x-4">
                <button onClick={handleLogout} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">Logout</button>
            </div>
        </nav>
    );
};

export default Navbar;
