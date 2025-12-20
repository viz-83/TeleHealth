import React, { useState } from 'react';
import axios from '../utils/axiosInstance';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

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

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleUseLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                setFormData({
                    ...formData,
                    coordinates: {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    }
                });
                alert('Location fetched successfully!');
            }, (error) => {
                console.error('Error fetching location:', error);
                alert('Unable to fetch location. Please enter manually or try again.');
            });
        } else {
            alert('Geolocation is not supported by this browser.');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const { data } = await axios.post('http://localhost:5000/api/v1/doctors/me/profile', formData, {
                headers: { Authorization: `Bearer ${token}` },
                withCredentials: true
            });

            if (data.status === 'success') {
                alert('Profile updated successfully!');
                navigate('/doctor/dashboard'); // Redirect to doctor dashboard
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            alert(error.response?.data?.message || 'Failed to update profile.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="max-w-3xl mx-auto px-4 py-8">
                <div className="bg-white rounded-lg shadow-md p-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Complete Your Doctor Profile</h1>
                    <p className="text-gray-600 mb-8 text-center">Please provide your professional details to be listed on MedSync.</p>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Specialization</label>
                            <select
                                name="specialization"
                                value={formData.specialization}
                                onChange={handleChange}
                                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Hospital / Clinic Name</label>
                            <input
                                type="text"
                                name="hospitalName"
                                value={formData.hospitalName}
                                onChange={handleChange}
                                placeholder="e.g. City General Hospital"
                                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                                <input
                                    type="text"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleChange}
                                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                                <input
                                    type="text"
                                    name="state"
                                    value={formData.state}
                                    onChange={handleChange}
                                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
                                <input
                                    type="text"
                                    name="pincode"
                                    value={formData.pincode}
                                    onChange={handleChange}
                                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Full Address</label>
                            <textarea
                                name="fullAddress"
                                value={formData.fullAddress}
                                onChange={handleChange}
                                rows="3"
                                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                required
                            ></textarea>
                        </div>

                        <div className="flex items-center justify-between bg-blue-50 p-4 rounded-lg border border-blue-100">
                            <div>
                                <p className="text-sm font-medium text-blue-800">Location Coordinates</p>
                                <p className="text-xs text-blue-600">
                                    {formData.coordinates.lat ? `Lat: ${formData.coordinates.lat}, Lng: ${formData.coordinates.lng}` : 'Not set'}
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={handleUseLocation}
                                className="px-4 py-2 bg-white text-blue-600 border border-blue-200 rounded hover:bg-blue-50 transition text-sm font-medium"
                            >
                                Use My Location
                            </button>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-bold text-lg shadow-lg disabled:bg-blue-300"
                        >
                            {loading ? 'Saving Profile...' : 'Save Profile'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default DoctorOnboarding;
