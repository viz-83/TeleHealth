import React, { useState } from 'react';
import axios from '../utils/axiosInstance';
import { useNavigate, Link } from 'react-router-dom';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

const Signup = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'patient' });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            await axios.post('http://localhost:5000/api/auth/signup', formData, { withCredentials: true });
            // Alert is okay here for MVP, or could use a toast/modal. Keeping simple for now but using browser alert is jarring.
            // Using a temporary success state or direct navigation is better.
            alert('Signup successful! Please check your email for OTP.');
            navigate('/verify-otp', { state: { email: formData.email } });
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

                    <div className="flex flex-col space-y-1.5">
                        <label className="text-sm font-medium text-text-secondary block mb-1">I am a...</label>
                        <select
                            name="role"
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 bg-surface border border-gray-200 dark:border-gray-700 rounded-xl text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors duration-200"
                        >
                            <option value="patient">Patient</option>
                            <option value="doctor">Doctor</option>
                        </select>
                    </div>

                    <Button
                        type="submit"
                        className="w-full"
                        size="md"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Creating Account...' : 'Sign Up'}
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
