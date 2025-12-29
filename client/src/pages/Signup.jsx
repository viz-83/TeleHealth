import React, { useState } from 'react';
import toast from 'react-hot-toast';
import axios from '../utils/axiosInstance';
import { useNavigate, Link } from 'react-router-dom';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { ChevronDown, Check } from 'lucide-react';

import { useAuth } from '../context/AuthContext';

const Signup = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'patient' });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [isRoleOpen, setIsRoleOpen] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const res = await axios.post('/auth/signup', formData, { withCredentials: true });

            // Handle Direct Login (No OTP)
            // Use AuthContext
            login(res.data.user, res.data.token);

            toast.success('Account created successfully!');

            // Redirect based on role
            if (formData.role === 'doctor') {
                // Doctor Onboarding check - though new doctors definitely need onboarding
                navigate('/doctor/onboarding');
            } else {
                navigate('/dashboard');
            }

        } catch (error) {
            setError(error.response?.data?.message || 'Signup failed. Please try again.');
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background-light px-4 py-12">
            <Card className="w-full max-w-md p-8 md:p-10 shadow-xl border-t-4 border-cta">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-heading font-bold text-text-primary mb-2">Create Account</h1>
                    <p className="text-text-secondary">Join MedSync for better healthcare</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 text-red-600 dark:text-red-400 rounded-xl text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <Input
                        label="Full Name"
                        type="text"
                        name="name"
                        placeholder="John Doe"
                        onChange={handleChange}
                        required
                    />
                    <Input
                        label="Email Address"
                        type="email"
                        name="email"
                        placeholder="you@example.com"
                        onChange={handleChange}
                        required
                    />
                    <Input
                        label="Password"
                        type="password"
                        name="password"
                        placeholder="••••••••"
                        onChange={handleChange}
                        required
                    />

                    <div className="flex flex-col space-y-1.5 relative">
                        <label className="text-sm font-medium text-text-secondary block mb-1">I am a...</label>

                        <button
                            type="button"
                            onClick={() => setIsRoleOpen(!isRoleOpen)}
                            className="w-full px-4 py-2.5 bg-surface border border-gray-200 dark:border-gray-700 rounded-xl text-text-primary text-left flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
                        >
                            <span className="capitalize">{formData.role}</span>
                            <ChevronDown size={18} className={`text-text-secondary transition-transform duration-200 ${isRoleOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {isRoleOpen && (
                            <>
                                <div className="fixed inset-0 z-10" onClick={() => setIsRoleOpen(false)}></div>
                                <div className="absolute top-full left-0 right-0 mt-2 bg-surface border border-gray-100 dark:border-gray-700 rounded-xl shadow-xl z-20 animate-fadeIn overflow-hidden">
                                    {['patient', 'doctor'].map((role) => (
                                        <div
                                            key={role}
                                            onClick={() => {
                                                setFormData({ ...formData, role: role });
                                                setIsRoleOpen(false);
                                            }}
                                            className={`px-4 py-2.5 cursor-pointer text-sm transition-colors duration-150 flex items-center justify-between capitalize ${formData.role === role ? 'bg-cta text-white font-medium' : 'text-text-primary hover:bg-cta hover:text-white'}`}
                                        >
                                            {role}
                                            {formData.role === role && <Check size={14} />}
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>

                    <Button
                        type="submit"
                        className="w-full"
                        size="md"
                        isLoading={isLoading}
                    >
                        Sign Up
                    </Button>
                </form>

                <div className="mt-8 text-center text-sm text-text-secondary">
                    Already have an account?{' '}
                    <Link to="/login" className="text-cta font-semibold hover:text-cta-hover">
                        Log In
                    </Link>
                </div>
            </Card>
        </div>
    );
};

export default Signup;
