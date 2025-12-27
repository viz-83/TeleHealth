import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import axios from '../utils/axiosInstance';
import { useSearchParams } from 'react-router-dom';
import Card from './ui/Card';
import Button from './ui/Button';
import Input from './ui/Input';
import Badge from './ui/Badge';
import Skeleton from './ui/Skeleton';
import Modal from './ui/Modal';
import { Stethoscope, ChevronDown, Check, Filter, X } from 'lucide-react';

const SPECIALIZATIONS = [
    "Cardiologist", "Dermatologist", "Pediatrician", "Neurologist",
    "General Physician", "Gastroenterologist", "Gynecologist", "Orthopedic",
    "ENT Specialist", "Psychiatrist", "Dentist", "Urologist",
    "Pulmonologist", "Ophthalmologist", "Endocrinologist"
];

// FilterPanel Component
const FilterPanel = ({
    className = "",
    city, setCity,
    cities, isCityOpen, setIsCityOpen,
    specialization, setSpecialization,
    isSpecOpen, setIsSpecOpen,
    date, setDate,
    loading,
    handleSearch,
    handleUseLocation,
    setShowFilters
}) => (
    <div className={`bg-surface p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 ${className}`}>
        <h2 className="text-xl font-heading font-bold text-text-primary mb-6">Filters</h2>

        <div className="space-y-6">
            <div className="flex flex-col space-y-1.5 relative">
                <label className="text-sm font-medium text-text-secondary block mb-1">Search by City</label>
                <button
                    onClick={() => setIsCityOpen(!isCityOpen)}
                    className="w-full px-4 py-2.5 bg-surface border border-gray-200 dark:border-gray-700 rounded-xl text-text-primary text-left flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
                >
                    <span className="truncate">{city || "Select City"}</span>
                    <ChevronDown size={18} className={`text-text-secondary transition-transform duration-200 ${isCityOpen ? 'rotate-180' : ''}`} />
                </button>
                {isCityOpen && (
                    <>
                        <div className="fixed inset-0 z-10" onClick={() => setIsCityOpen(false)}></div>
                        <div className="absolute top-full left-0 right-0 mt-2 bg-surface border border-gray-100 dark:border-gray-700 rounded-xl shadow-xl max-h-60 overflow-y-auto z-20 animate-fadeIn">
                            <div
                                onClick={() => { setCity(""); setIsCityOpen(false); }}
                                className={`px-4 py-2.5 cursor-pointer text-sm transition-colors duration-150 flex items-center justify-between ${city === "" ? 'bg-cta text-white font-medium' : 'text-text-primary hover:bg-cta hover:text-white'}`}
                            >
                                All Cities
                                {city === "" && <Check size={14} />}
                            </div>
                            {cities && cities.map((c) => (
                                <div
                                    key={c}
                                    onClick={() => { setCity(c); setIsCityOpen(false); }}
                                    className={`px-4 py-2.5 cursor-pointer text-sm transition-colors duration-150 flex items-center justify-between ${city === c ? 'bg-cta text-white font-medium' : 'text-text-primary hover:bg-cta hover:text-white'}`}
                                >
                                    {c}
                                    {city === c && <Check size={14} />}
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>

            <div className="flex flex-col space-y-1.5 relative">
                <label className="text-sm font-medium text-text-secondary block mb-1">Specialization</label>

                <button
                    onClick={() => setIsSpecOpen(!isSpecOpen)}
                    className="w-full px-4 py-2.5 bg-surface border border-gray-200 dark:border-gray-700 rounded-xl text-text-primary text-left flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
                >
                    <span className="truncate">{specialization || "All Specializations"}</span>
                    <ChevronDown size={18} className={`text-text-secondary transition-transform duration-200 ${isSpecOpen ? 'rotate-180' : ''}`} />
                </button>

                {isSpecOpen && (
                    <>
                        <div className="fixed inset-0 z-10" onClick={() => setIsSpecOpen(false)}></div>
                        <div className="absolute top-full left-0 right-0 mt-2 bg-surface border border-gray-100 dark:border-gray-700 rounded-xl shadow-xl max-h-60 overflow-y-auto z-20 animate-fadeIn">
                            <div
                                onClick={() => { setSpecialization(""); setIsSpecOpen(false); }}
                                className={`px-4 py-2.5 cursor-pointer text-sm transition-colors duration-150 flex items-center justify-between ${specialization === "" ? 'bg-cta text-white font-medium' : 'text-text-primary hover:bg-cta hover:text-white'}`}
                            >
                                All Specializations
                                {specialization === "" && <Check size={14} />}
                            </div>
                            {SPECIALIZATIONS.map((spec) => (
                                <div
                                    key={spec}
                                    onClick={() => { setSpecialization(spec); setIsSpecOpen(false); }}
                                    className={`px-4 py-2.5 cursor-pointer text-sm transition-colors duration-150 flex items-center justify-between ${specialization === spec ? 'bg-cta text-white font-medium' : 'text-text-primary hover:bg-cta hover:text-white'}`}
                                >
                                    {spec}
                                    {specialization === spec && <Check size={14} />}
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>

            <Input
                label="Preferred Date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
            />

            <div className="flex flex-col gap-3 pt-2">
                <Button onClick={() => { handleSearch(); if (setShowFilters) setShowFilters(false); }} isLoading={loading} className="w-full">
                    Search Doctors
                </Button>
                <Button variant="secondary" onClick={handleUseLocation} disabled={loading} className="w-full">
                    Use My Location
                </Button>
            </div>
        </div>
    </div>
);

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
    const [isSpecOpen, setIsSpecOpen] = useState(false);
    const [isCityOpen, setIsCityOpen] = useState(false);
    const [cities, setCities] = useState([]);
    const [showFilters, setShowFilters] = useState(false);

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [slotToBook, setSlotToBook] = useState(null);

    // Initial load from params
    useEffect(() => {
        const specParam = searchParams.get('specialization');
        if (specParam) {
            setSpecialization(specParam);
            handleSearch(specParam);
        }
        fetchCities();
    }, [searchParams]);

    const fetchCities = async () => {
        try {
            const token = localStorage.getItem('token');
            const { data } = await axios.get('http://localhost:5000/api/v1/doctors/cities', {
                headers: { Authorization: `Bearer ${token}` },
                withCredentials: true
            });
            if (data.status === 'success') {
                setCities(data.data.cities);
            }
        } catch (error) {
            console.error('Error fetching cities:', error);
        }
    };

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
                    toast.error('Failed to find nearby doctors.');
                } finally {
                    setLoading(false);
                }
            }, (error) => {
                console.error('Geolocation error:', error);
                toast.error('Unable to retrieve your location.');
            });
        } else {
            toast.error('Geolocation is not supported by this browser.');
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
            toast.error('Failed to fetch availability.');
        }
    };

    const executeBooking = async () => {
        if (!selectedDoctor || !slotToBook) return;

        setBookingLoading(true);
        try {
            const token = localStorage.getItem('token');
            const { data } = await axios.post('http://localhost:5000/api/v1/appointments', {
                doctorId: selectedDoctor._id,
                date,
                startTime: slotToBook.startTime,
                endTime: slotToBook.endTime
            }, {
                headers: { Authorization: `Bearer ${token}` },
                withCredentials: true
            });

            if (data.status === 'success') {
                toast.success('Appointment booked successfully!');
                handleViewAvailability(selectedDoctor);
                setIsModalOpen(false); // Close Modal
            }
        } catch (error) {
            console.error('Error booking appointment:', error);
            toast.error(error.response?.data?.message || 'Failed to book appointment.');
        } finally {
            setBookingLoading(false);
        }
    };

    const handleBookSlot = (slot) => {
        setSlotToBook(slot);
        setIsModalOpen(true);
    };

    // Prepare props for FilterPanel
    const filterProps = {
        city, setCity,
        cities, isCityOpen, setIsCityOpen,
        specialization, setSpecialization,
        isSpecOpen, setIsSpecOpen,
        date, setDate,
        loading,
        handleSearch,
        handleUseLocation,
        setShowFilters
    };

    return (
        <div className="flex flex-col lg:flex-row gap-8 relative">
            {/* Desktop Sidebar - Sticky */}
            <div className="hidden lg:block lg:w-1/4">
                <FilterPanel {...filterProps} className="sticky top-24" />
            </div>

            {/* Mobile Filters Trigger */}
            <div className="lg:hidden mb-4">
                <Button variant="secondary" onClick={() => setShowFilters(true)} className="w-full flex items-center justify-center gap-2">
                    <Filter size={18} /> Filters & Search
                </Button>
            </div>

            {/* Mobile Filters Drawer */}
            {showFilters && (
                <div className="fixed inset-0 z-50 lg:hidden font-body">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowFilters(false)}></div>
                    <div className="absolute right-0 top-0 bottom-0 w-full sm:w-96 bg-surface shadow-2xl animate-slideLeft flex flex-col">
                        <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-surface sticky top-0 z-10">
                            <h2 className="text-lg font-bold">Search Filters</h2>
                            <button onClick={() => setShowFilters(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-4 overflow-y-auto">
                            <FilterPanel {...filterProps} className="border-0 shadow-none p-0" />
                        </div>
                    </div>
                </div>
            )}

            {/* Results Grid */}
            <div className="lg:w-3/4">
                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="bg-surface rounded-2xl shadow-soft border border-gray-100 dark:border-gray-700 p-6 h-64 flex flex-col justify-between">
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <Skeleton className="h-6 w-32" />
                                        <Skeleton className="h-6 w-20 rounded-full" />
                                    </div>
                                    <Skeleton className="h-4 w-24" />
                                    <Skeleton className="h-4 w-40" />
                                </div>
                                <Skeleton className="h-10 w-full rounded-xl" />
                            </div>
                        ))}
                    </div>
                ) : doctors.length === 0 ? (
                    <div className="text-center py-20 bg-surface rounded-2xl border border-dashed border-gray-200 dark:border-gray-700">
                        <div className="flex justify-center mb-4">
                            <Stethoscope className="w-16 h-16 text-gray-300 dark:text-gray-600" />
                        </div>
                        <h3 className="text-xl font-bold text-text-primary">No doctors found</h3>
                        <p className="text-text-secondary mt-2">Try adjusting your filters or search a different area.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                        {doctors.map((doctor) => (
                            <Card key={doctor._id} className={`p-0 border border-gray-100 dark:border-gray-700 ${selectedDoctor?._id === doctor._id ? 'ring-2 ring-cta' : ''}`}>
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
                                                <div className="space-y-2 py-4">
                                                    <div className="flex gap-2">
                                                        <Skeleton className="h-8 w-16 rounded-lg" />
                                                        <Skeleton className="h-8 w-16 rounded-lg" />
                                                        <Skeleton className="h-8 w-16 rounded-lg" />
                                                    </div>
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

            {/* Booking Confirmation Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Confirm Appointment"
            >
                <div>
                    <p className="text-text-secondary mb-6">
                        You are about to book an appointment with <strong>{selectedDoctor?.name}</strong> on <span className="text-text-primary font-medium">{date}</span> at <span className="text-text-primary font-medium">{slotToBook?.startTime}</span>.
                    </p>
                    <div className="flex justify-end gap-3">
                        <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={executeBooking} isLoading={bookingLoading}>
                            Confirm Booking
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default FindDoctorsSection;
