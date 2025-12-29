import React, { useState } from 'react';
import toast from 'react-hot-toast';
import axios from '../utils/axiosInstance';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Badge from '../components/ui/Badge';

const DoctorOnboarding = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        specialization: '',
        hospitalName: '',
        city: '',
        state: '',
        pincode: '',
        fullAddress: '',
        coordinates: { lat: null, lng: null }
    });
    const [loading, setLoading] = useState(false);
    const [locationStatus, setLocationStatus] = useState('idle'); // idle, loading, success, error

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleUseLocation = () => {
        if (navigator.geolocation) {
            setLocationStatus('loading');
            navigator.geolocation.getCurrentPosition((position) => {
                setFormData({
                    ...formData,
                    coordinates: {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    }
                });
                setLocationStatus('success');
            }, (error) => {
                console.error('Error fetching location:', error);
                setLocationStatus('error');
            });
        } else {
            toast.error('Geolocation is not supported by this browser.');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const { data } = await axios.post('/v1/doctors/me/profile', formData, {
                headers: { Authorization: `Bearer ${token}` },
                withCredentials: true
            });

            if (data.status === 'success') {
                navigate('/doctor/dashboard'); // Redirect to doctor dashboard
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error(error.response?.data?.message || 'Failed to update profile.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background-light flex flex-col font-body">
            <Navbar />
            <div className="flex-1 flex flex-col items-center justify-center p-4">
                <Card className="w-full max-w-3xl p-4 sm:p-8 md:p-10 shadow-xl border-t-4 border-cta">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl shadow-sm">
                            👨‍⚕️
                        </div>
                        <h1 className="text-3xl font-heading font-bold text-text-primary mb-2">Complete Your Profile</h1>
                        <p className="text-text-secondary max-w-md mx-auto">
                            Please provide your professional details to be listed on MedSync and start accepting appointments.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-text-primary mb-2">Specialization</label>
                                <select
                                    name="specialization"
                                    value={formData.specialization}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-cta focus:ring-2 focus:ring-cta/10 bg-gray-50/50 transition-all outline-none"
                                    required
                                >
                                    <option value="">Select Specialization</option>
                                    <option value="Cardiologist">Cardiologist</option>
                                    <option value="Dermatologist">Dermatologist</option>
                                    <option value="Pediatrician">Pediatrician</option>
                                    <option value="Neurologist">Neurologist</option>
                                    <option value="General Physician">General Physician</option>
                                    <option value="Orthopedic">Orthopedic</option>
                                    <option value="Dentist">Dentist</option>
                                </select>
                            </div>

                            <Input
                                label="Hospital / Clinic Name"
                                name="hospitalName"
                                value={formData.hospitalName}
                                onChange={handleChange}
                                placeholder="e.g. City General Hospital"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <Input
                                label="City"
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                required
                            />
                            <Input
                                label="State"
                                name="state"
                                value={formData.state}
                                onChange={handleChange}
                                required
                            />
                            <Input
                                label="Pincode"
                                name="pincode"
                                value={formData.pincode}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-text-primary mb-2">Full Address</label>
                            <textarea
                                name="fullAddress"
                                value={formData.fullAddress}
                                onChange={handleChange}
                                rows="3"
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-cta focus:ring-2 focus:ring-cta/10 bg-gray-50/50 transition-all outline-none resize-none"
                                required
                                placeholder="Enter complete clinic address..."
                            ></textarea>
                        </div>

                        <div className="flex items-center justify-between bg-blue-50 p-5 rounded-xl border border-blue-100">
                            <div>
                                <p className="font-heading font-bold text-blue-800 mb-1">Clinic Location</p>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-blue-600">
                                        {formData.coordinates.lat
                                            ? `Lat: ${formData.coordinates.lat.toFixed(4)}, Lng: ${formData.coordinates.lng.toFixed(4)}`
                                            : 'Location not set'}
                                    </span>
                                    {locationStatus === 'success' && <Badge variant="success" className="text-xs">Saved</Badge>}
                                    {locationStatus === 'error' && <Badge variant="danger" className="text-xs">Failed</Badge>}
                                </div>
                            </div>
                            <Button
                                type="button"
                                onClick={handleUseLocation}
                                variant="secondary"
                                isLoading={locationStatus === 'loading'}
                                className="text-sm"
                            >
                                Use My Location
                            </Button>
                        </div>

                        <Button
                            type="submit"
                            isLoading={loading}
                            size="lg"
                            className="w-full mt-4 shadow-lg shadow-cta/20"
                        >
                            Complete Profile
                        </Button>
                    </form>
                </Card>
            </div>
        </div>
    );
};

export default DoctorOnboarding;
