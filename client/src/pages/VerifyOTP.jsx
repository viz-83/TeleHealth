import React, { useState } from 'react';
import axios from '../utils/axiosInstance';
import { useNavigate, useLocation } from 'react-router-dom';

const VerifyOTP = () => {
    const [otp, setOtp] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email;

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5000/api/auth/verify-otp', { email, otp }, { withCredentials: true });
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            alert('Verification successful!');
            if (res.data.user.role === 'doctor') {
                if (res.data.isDoctorProfileComplete) {
                    navigate('/doctor/dashboard');
                } else {
                    navigate('/doctor/onboarding');
                }
            } else {
                navigate('/dashboard');
            }
        } catch (error) {
            alert(error.response?.data?.message || 'Verification failed');
        }
    };

    if (!email) {
        return <div className="text-center mt-10">Error: No email provided. Please signup again.</div>;
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-96">
                <h2 className="text-2xl font-bold mb-6 text-center">Verify OTP</h2>
                <p className="mb-4 text-center text-gray-600">Enter the OTP sent to {email}</p>
                <input
                    type="text"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full p-2 mb-4 border rounded"
                    required
                />
                <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">Verify</button>
            </form>
        </div>
    );
};

export default VerifyOTP;
