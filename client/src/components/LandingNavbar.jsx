import React from 'react';
import { Link } from 'react-router-dom';

const LandingNavbar = () => {
    return (
        <nav className="bg-white shadow-md p-4 flex justify-between items-center fixed top-0 w-full z-10">
            <div className="flex items-center space-x-8">
                <Link to="/" className="text-2xl font-bold text-blue-600">MedSync</Link>
                <div className="hidden md:flex space-x-6">
                    <Link to="/" className="text-gray-700 hover:text-blue-600 font-medium">Home</Link>
                    <Link to="#" className="text-gray-700 hover:text-blue-600 font-medium">About</Link>
                    <Link to="#" className="text-gray-700 hover:text-blue-600 font-medium">Services</Link>
                    <Link to="#" className="text-gray-700 hover:text-blue-600 font-medium">Contact</Link>
                </div>
            </div>
            <div className="flex items-center space-x-4">
                <Link to="/login" className="text-blue-600 font-semibold hover:text-blue-800">Login</Link>
                <Link to="/signup" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-semibold transition">Sign Up</Link>
            </div>
        </nav>
    );
};

export default LandingNavbar;
