import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';

const FindDoctors = () => {
    const [city, setCity] = useState('');
    const [specialization, setSpecialization] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [availability, setAvailability] = useState(null);
    const [bookingLoading, setBookingLoading] = useState(false);

    const handleSearch = async () => {
        setLoading(true);
        setDoctors([]);
        setSelectedDoctor(null);
        setAvailability(null);

        try {
            let params = {};
            if (city) params.city = city;
            if (specialization) params.specialization = specialization;

            // If using geolocation (optional enhancement later), add lat/lng
            // For now, simple search

            const token = localStorage.getItem('token');
            const { data } = await axios.get('http://localhost:5000/api/v1/doctors/nearby', {
                params,
                headers: { Authorization: `Bearer ${token}` },
                withCredentials: true
            });

            if (data.status === 'success') {
                setDoctors(data.data.doctors);
            }
        } catch (error) {
            console.error('Error searching doctors:', error);
            alert('Failed to search doctors. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleUseLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(async (position) => {
                const { latitude, longitude } = position.coords;
                setLoading(true);
                try {
                    const token = localStorage.getItem('token');
                    const { data } = await axios.get('http://localhost:5000/api/v1/doctors/nearby', {
                        params: { lat: latitude, lng: longitude, specialization },
                        headers: { Authorization: `Bearer ${token}` },
                        withCredentials: true
                    });
                    if (data.status === 'success') {
                        setDoctors(data.data.doctors);
                    }
                } catch (error) {
                    console.error('Error searching nearby:', error);
                    alert('Failed to find nearby doctors.');
                } finally {
                    setLoading(false);
                }
            }, (error) => {
                console.error('Geolocation error:', error);
                alert('Unable to retrieve your location.');
            });
        } else {
            alert('Geolocation is not supported by this browser.');
        }
    };

    const handleViewAvailability = async (doctor) => {
        setSelectedDoctor(doctor);
        setAvailability(null);
        try {
            const token = localStorage.getItem('token');
            const { data } = await axios.get(`http://localhost:5000/api/v1/doctors/${doctor._id}/availability`, {
                params: { date },
                headers: { Authorization: `Bearer ${token}` },
                withCredentials: true
            });
            if (data.status === 'success') {
                setAvailability(data.data);
            }
        } catch (error) {
            console.error('Error fetching availability:', error);
            alert('Failed to fetch availability.');
        }
    };

    const handleBookSlot = async (slot) => {
        if (!confirm(`Book appointment with ${selectedDoctor.name} on ${date} at ${slot.startTime}?`)) return;

        setBookingLoading(true);
        try {
            const token = localStorage.getItem('token');
            const { data } = await axios.post('http://localhost:5000/api/v1/appointments', {
                doctorId: selectedDoctor._id,
                date,
                startTime: slot.startTime,
                endTime: slot.endTime
            }, {
                headers: { Authorization: `Bearer ${token}` },
                withCredentials: true
            });

            if (data.status === 'success') {
                alert('Appointment booked successfully!');
                // Refresh availability to show the slot as booked
                handleViewAvailability(selectedDoctor);
            }
        } catch (error) {
            console.error('Error booking appointment:', error);
            alert(error.response?.data?.message || 'Failed to book appointment.');
        } finally {
            setBookingLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-8">Find Doctors</h1>

                {/* Search Section */}
                <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                            <input
                                type="text"
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                                placeholder="e.g. New York"
                                className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Specialization</label>
                            <select
                                value={specialization}
                                onChange={(e) => setSpecialization(e.target.value)}
                                className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="">All Specializations</option>
                                <option value="Cardiologist">Cardiologist</option>
                                <option value="Dermatologist">Dermatologist</option>
                                <option value="Pediatrician">Pediatrician</option>
                                <option value="Neurologist">Neurologist</option>
                                <option value="General Physician">General Physician</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                            <input
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <div className="flex space-x-2">
                            <button
                                onClick={handleSearch}
                                disabled={loading}
                                className="flex-1 bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:bg-blue-300"
                            >
                                {loading ? 'Searching...' : 'Search'}
                            </button>
                            <button
                                onClick={handleUseLocation}
                                disabled={loading}
                                className="bg-gray-200 text-gray-700 p-2 rounded hover:bg-gray-300"
                                title="Use My Location"
                            >
                                📍
                            </button>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Results List */}
                    <div className="lg:col-span-2 space-y-4">
                        {doctors.length === 0 && !loading && (
                            <p className="text-gray-500 text-center py-8">No doctors found. Try adjusting your search.</p>
                        )}
                        {doctors.map((doctor) => (
                            <div key={doctor._id} className="bg-white p-6 rounded-lg shadow-md flex justify-between items-start">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-800">{doctor.name}</h3>
                                    <p className="text-blue-600 font-medium">{doctor.specialization}</p>
                                    <p className="text-gray-600">{doctor.hospitalName}</p>
                                    <p className="text-gray-500 text-sm mt-1">📍 {doctor.location.city}, {doctor.location.state}</p>
                                </div>
                                <button
                                    onClick={() => handleViewAvailability(doctor)}
                                    className="px-4 py-2 border border-blue-600 text-blue-600 rounded hover:bg-blue-50"
                                >
                                    View Availability
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Availability Panel */}
                    <div className="lg:col-span-1">
                        {selectedDoctor && (
                            <div className="bg-white p-6 rounded-lg shadow-md sticky top-24">
                                <h3 className="text-lg font-bold text-gray-800 mb-2">Availability for {selectedDoctor.name}</h3>
                                <p className="text-gray-600 mb-4">Date: {date}</p>

                                {availability ? (
                                    availability.slots.length > 0 ? (
                                        <div className="grid grid-cols-2 gap-2">
                                            {availability.slots.map((slot, index) => (
                                                <button
                                                    key={index}
                                                    disabled={slot.isBooked || bookingLoading}
                                                    onClick={() => !slot.isBooked && handleBookSlot(slot)}
                                                    className={`p-2 text-sm rounded text-center transition ${slot.isBooked
                                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                        : 'bg-green-50 text-green-700 border border-green-200 hover:bg-green-100'
                                                        }`}
                                                >
                                                    {slot.startTime}
                                                </button>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-gray-500">No slots available for this date.</p>
                                    )
                                ) : (
                                    <p className="text-gray-500">Loading slots...</p>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FindDoctors;
