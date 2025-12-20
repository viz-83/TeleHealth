import React, { useState, useEffect } from 'react';
import axios from '../utils/axiosInstance';
import { useSearchParams } from 'react-router-dom';

const FindDoctorsSection = () => {
    const [searchParams] = useSearchParams();
    const [city, setCity] = useState('');
    const [specialization, setSpecialization] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [availability, setAvailability] = useState(null);
    const [bookingLoading, setBookingLoading] = useState(false);

    // Initial load from params
    useEffect(() => {
        const specParam = searchParams.get('specialization');
        if (specParam) {
            setSpecialization(specParam);
            // Trigger search immediately if param exists
            handleSearch(specParam);
        }
    }, [searchParams]);

    const handleSearch = async (overrideSpec = null) => {
        setLoading(true);
        setDoctors([]);
        setSelectedDoctor(null);
        setAvailability(null);

        try {
            let params = {};
            if (city) params.city = city;

            const specToUse = overrideSpec || specialization;
            if (specToUse) params.specialization = specToUse;

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
            // alert('Failed to search doctors. Please try again.'); // Muted alert to avoid double alerts on mount
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
        <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Find Doctors</h2>

            {/* Search Section */}
            <div className="bg-gray-50 p-6 rounded-lg mb-8 border border-gray-100">
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
                            <option value="Gastroenterologist">Gastroenterologist</option>
                            <option value="Gynecologist">Gynecologist</option>
                            <option value="Orthopedic">Orthopedic</option>
                            <option value="ENT Specialist">ENT Specialist</option>
                            <option value="Psychiatrist">Psychiatrist</option>
                            <option value="Dentist">Dentist</option>
                            <option value="Urologist">Urologist</option>
                            <option value="Pulmonologist">Pulmonologist</option>
                            <option value="Ophthalmologist">Ophthalmologist</option>
                            <option value="Endocrinologist">Endocrinologist</option>
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
                            className="flex-1 bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:bg-blue-300 transition"
                        >
                            {loading ? 'Searching...' : 'Search'}
                        </button>
                        <button
                            onClick={handleUseLocation}
                            disabled={loading}
                            className="bg-white border border-gray-300 text-gray-700 p-2 rounded hover:bg-gray-50 transition"
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
                        <p className="text-gray-500 text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                            No doctors found. Try adjusting your search.
                        </p>
                    )}
                    {doctors.map((doctor) => (
                        <div key={doctor._id} className="bg-white border border-gray-100 p-6 rounded-lg shadow-sm hover:shadow-md transition flex justify-between items-start">
                            <div>
                                <h3 className="text-xl font-bold text-gray-800">{doctor.name}</h3>
                                <p className="text-blue-600 font-medium">{doctor.specialization}</p>
                                <p className="text-gray-600">{doctor.hospitalName}</p>
                                <p className="text-gray-500 text-sm mt-1">📍 {doctor.location.city}, {doctor.location.state}</p>
                            </div>
                            <button
                                onClick={() => handleViewAvailability(doctor)}
                                className="px-4 py-2 border border-blue-600 text-blue-600 rounded hover:bg-blue-50 transition"
                            >
                                View Availability
                            </button>
                        </div>
                    ))}
                </div>

                {/* Availability Panel */}
                <div className="lg:col-span-1">
                    {selectedDoctor && (
                        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 sticky top-24">
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
    );
};

export default FindDoctorsSection;
