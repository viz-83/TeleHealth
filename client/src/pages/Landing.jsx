import React from 'react';
import { Link } from 'react-router-dom';

const Landing = () => {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
            <h1 className="text-5xl font-bold text-blue-600 mb-4">Telehealth App</h1>
            <p className="text-xl text-gray-600 mb-8">Connect with doctors instantly via video and chat.</p>
            <div className="space-x-4">
                <Link to="/login" className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">Login</Link>
                <Link to="/signup" className="px-6 py-3 bg-white text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition">Signup</Link>
            </div>
        </div>
    );
};

export default Landing;
