import React, { useState, useEffect } from 'react';
import axios from '../utils/axiosInstance';
import { useSearchParams } from 'react-router-dom';
import Card from './ui/Card';
import Button from './ui/Button';
import Input from './ui/Input';
import Badge from './ui/Badge';

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
        if (selectedDoctor?._id === doctor._id) {
            setSelectedDoctor(null); // Toggle off
            setAvailability(null);
            return;
        }

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
        <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Filters - Sticky on Desktop */}
            <div className="lg:w-1/4">
                <div className="bg-surface p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 sticky top-24">
                    <h2 className="text-xl font-heading font-bold text-text-primary mb-6">Filters</h2>

                    <div className="space-y-6">
                        <Input
                            label="Search by City"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            placeholder="e.g. New York"
                        />

                        <div className="flex flex-col space-y-1.5">
                            <label className="text-sm font-medium text-text-secondary block mb-1">Specialization</label>
                            <select
                                value={specialization}
                                onChange={(e) => setSpecialization(e.target.value)}
                                className="w-full px-4 py-2.5 bg-surface border border-gray-200 dark:border-gray-700 rounded-xl text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors duration-200"
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

                        <Input
                            label="Preferred Date"
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                        />

                        <div className="flex flex-col gap-3 pt-2">
                            <Button onClick={() => handleSearch()} disabled={loading} className="w-full">
                                {loading ? 'Searching...' : 'Search Doctors'}
                            </Button>
                            <Button variant="secondary" onClick={handleUseLocation} disabled={loading} className="w-full">
                                Use My Location
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Results Grid */}
            <div className="lg:w-3/4">
                {doctors.length === 0 && !loading ? (
                    <div className="text-center py-20 bg-surface rounded-2xl border border-dashed border-gray-200 dark:border-gray-700">
                        <div className="text-6xl mb-4">🩺</div>
                        <h3 className="text-xl font-bold text-text-primary">No doctors found</h3>
                        <p className="text-text-secondary mt-2">Try adjusting your filters or search a different area.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {doctors.map((doctor) => (
                            <Card key={doctor._id} className={`p-0 overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-100 dark:border-gray-700 ${selectedDoctor?._id === doctor._id ? 'ring-2 ring-cta' : ''}`}>
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="text-xl font-heading font-bold text-text-primary">{doctor.name}</h3>
                                            <p className="text-cta font-medium text-sm">{doctor.specialization}</p>
                                        </div>
                                        <Badge variant="primary">Available</Badge>
                                    </div>

                                    <div className="space-y-2 mb-6">
                                        <div className="flex items-center text-text-secondary text-sm">
                                            <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                                            {doctor.hospitalName}
                                        </div>
                                        <div className="flex items-center text-text-secondary text-sm">
                                            <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                            {doctor.location.city}, {doctor.location.state}
                                        </div>
                                    </div>

                                    <Button
                                        variant={selectedDoctor?._id === doctor._id ? "primary" : "secondary"}
                                        className="w-full justify-center"
                                        onClick={() => handleViewAvailability(doctor)}
                                    >
                                        {selectedDoctor?._id === doctor._id ? 'Hide Availability' : 'View Availability'}
                                    </Button>

                                    {/* Inline Availability Panel */}
                                    {selectedDoctor?._id === doctor._id && (
                                        <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700 animate-fadeIn">
                                            <h4 className="font-bold text-text-primary text-sm mb-3">Available Slots for {date}:</h4>

                                            {availability ? (
                                                availability.slots.length > 0 ? (
                                                    <div className="grid grid-cols-3 gap-2">
                                                        {availability.slots.map((slot, index) => (
                                                            <button
                                                                key={index}
                                                                disabled={slot.isBooked || bookingLoading}
                                                                onClick={() => !slot.isBooked && handleBookSlot(slot)}
                                                                className={`
                                                                    py-2 px-1 text-xs font-bold rounded-lg transition-all border
                                                                    ${slot.isBooked
                                                                        ? 'text-gray-400 dark:text-gray-500 border-gray-100 dark:border-gray-700 cursor-not-allowed line-through'
                                                                        : 'text-green-700 dark:text-green-400 border-green-200 dark:border-green-800 hover:border-green-500 hover:shadow-sm hover:!bg-green-50 dark:hover:!bg-gray-700'}
                                                                `}
                                                                style={{ backgroundColor: slot.isBooked ? 'var(--bg-light)' : 'var(--bg-surface)' }}
                                                            >
                                                                {slot.startTime}
                                                            </button>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <div className="text-center py-4 text-text-muted text-sm bg-gray-50 rounded">
                                                        No slots available
                                                    </div>
                                                )
                                            ) : (
                                                <div className="flex justify-center py-4">
                                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-cta"></div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default FindDoctorsSection;
