import React, { useState } from 'react';
import axios from '../utils/axiosInstance';
import { useNavigate, Link } from 'react-router-dom';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError(''); // Clear error on typing
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const res = await axios.post('http://localhost:5000/api/auth/login', formData, { withCredentials: true });
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));

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
            setError(error.response?.data?.message || 'Login failed. Please try again.');
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background-light px-4">
            <Card className="w-full max-w-md p-8 md:p-10 shadow-xl border-t-4 border-cta">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-heading font-bold text-text-primary mb-2">Welcome Back</h1>
                    <p className="text-text-secondary">Sign in to access your healthcare portal</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 text-red-600 dark:text-red-400 rounded-xl text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
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

                    <Button
                        type="submit"
                        className="w-full"
                        size="md"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Signing in...' : 'Sign In'}
                    </Button>
                </form>

                <div className="mt-8 text-center text-sm text-text-secondary">
                    Don't have an account?{' '}
                    <Link to="/signup" className="text-cta font-semibold hover:text-cta-hover">
                        Create Account
                    </Link>
                </div>
            </Card>
        </div>
    );
};

export default Login;
