import React, { useState } from 'react';
import axios from '../utils/axiosInstance';
import { useNavigate, Link } from 'react-router-dom';

const Signup = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'patient' });
    const navigate = useNavigate();

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/auth/signup', formData, { withCredentials: true });
            alert('Signup successful! Please check your email for OTP.');
            // navigate('/login');
            navigate('/verify-otp', { state: { email: formData.email } });
        } catch (error) {
            alert(error.response?.data?.message || 'Signup failed');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-96">
                <h2 className="text-2xl font-bold mb-6 text-center">Signup</h2>
                <input type="text" name="name" placeholder="Name" onChange={handleChange} className="w-full p-2 mb-4 border rounded" required />
                <input type="email" name="email" placeholder="Email" onChange={handleChange} className="w-full p-2 mb-4 border rounded" required />
                <input type="password" name="password" placeholder="Password" onChange={handleChange} className="w-full p-2 mb-4 border rounded" required />
                <select name="role" onChange={handleChange} className="w-full p-2 mb-4 border rounded">
                    <option value="patient">Patient</option>
                    <option value="doctor">Doctor</option>
                </select>
                <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">Signup</button>
                <p className="mt-4 text-center text-sm">Already have an account? <Link to="/login" className="text-blue-600">Login</Link></p>
            </form>
        </div>
    );
};

export default Signup;
