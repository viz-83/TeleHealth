import React, { useState, useEffect } from 'react';
import axios from '../utils/axiosInstance';
import Navbar from '../components/Navbar';
import { FaPlus, FaTrash, FaSave, FaClock } from 'react-icons/fa';

const DAYS = [
    { id: 0, name: 'Sunday' },
    { id: 1, name: 'Monday' },
    { id: 2, name: 'Tuesday' },
    { id: 3, name: 'Wednesday' },
    { id: 4, name: 'Thursday' },
    { id: 5, name: 'Friday' },
    { id: 6, name: 'Saturday' }
];

const DoctorAvailability = () => {
    const [availability, setAvailability] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        fetchAvailability();
    }, []);

    const fetchAvailability = async () => {
        try {
            const token = localStorage.getItem('token');
            // We need to fetch the doctor's profile to get current availability
            // Assuming we have an endpoint for 'me' or we use the profile update endpoint to get data?
            // Usually GET /me/profile would exist, but let's check existing routes.
            // If not, we might need to rely on what we have. 
            // In doctorController, createOrUpdateMyDoctorProfile returns the doctor.
            // Let's assume we can fetch it via a GET request if mapped, OR we use the user's doctor ID if stored.
            // Wait, looking at routes... `router.post('/me/profile', ...)` is there. 
            // Is there a GET /me? 
            // Let's assume for now we might need to add GET /me/profile or use a known endpoint.
            // Actually, let's just make a specialized GET for availability if needed, but standard REST usually has GET /me for users.
            // For now, I'll attempt to GET /api/v1/doctors/me/profile if it existed, but it doesn't seem to.
            // I'll check if I can add `getDoctorProfile` to the controller/routes quickly.
            // Limitation: I am in the middle of writing this file.
            // WORKAROUND: I will fetch the doctor by 'nearby' query or similar? No that's bad.
            // Let's look at `doctorRoutes.js` again. `router.get('/:id/availability')`.
            // I can use that IF I know my own doctor ID.
            // The user context usually has the user ID. 
            // Maybe I should add `router.get('/me', ...)` to `doctorRoutes.js`.
            // I will add that separately. For now, I'll write this component assuming I can GET `/api/v1/doctors/me`.

            const res = await axios.get('http://localhost:5000/api/v1/doctors/me', {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.data.data.doctor) {
                setAvailability(res.data.data.doctor.availabilitySlots || []);
            }
            setLoading(false);
        } catch (err) {
            console.error(err);
            // If 404, maybe no profile yet, which is fine.
            setLoading(false);
        }
    };

    const handleAddSlot = (dayId) => {
        setAvailability([...availability, { dayOfWeek: dayId, startTime: '09:00', endTime: '17:00' }]);
    };

    const handleRemoveSlot = (index) => {
        const newAvailability = [...availability];
        newAvailability.splice(index, 1);
        setAvailability(newAvailability);
    };

    const handleChangeSlot = (index, field, value) => {
        const newAvailability = [...availability];
        newAvailability[index][field] = value;
        setAvailability(newAvailability);
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            setError(null);
            setSuccessMessage('');
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:5000/api/v1/doctors/me/availability', {
                availabilitySlots: availability
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSuccessMessage('Availability updated successfully!');
            setSaving(false);
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Failed to update availability');
            setSaving(false);
        }
    };

    const getSlotsForDay = (dayId) => {
        return availability.filter(slot => slot.dayOfWeek === dayId);
    };

    // Helper to find the logic index in the main state array
    const getRealIndex = (dayId, slotsOnDay, relativeIndex) => {
        // This is tricky because we filter. 
        // Easier approach: Just map over the main availability array in logic, 
        // but for rendering by Data Transfer Object (DTO) we group.
        // Actually, let's just render the list flat? No, grouped by day is better UI.
        // Let's iterate DAYS and then find slots in availability array.
        // We need the index to update.
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />
            <div className="flex-1 max-w-4xl mx-auto w-full p-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">Manage Availability</h1>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-md disabled:bg-blue-300"
                    >
                        <FaSave className="mr-2" />
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>

                {error && (
                    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
                        <p>{error}</p>
                    </div>
                )}

                {successMessage && (
                    <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6" role="alert">
                        <p>{successMessage}</p>
                    </div>
                )}

                <div className="space-y-6">
                    {DAYS.map((day) => (
                        <div key={day.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-semibold text-gray-800 flex items-center">
                                    <span className="w-24">{day.name}</span>
                                </h3>
                                <button
                                    onClick={() => handleAddSlot(day.id)}
                                    className="text-sm px-3 py-1 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition flex items-center"
                                >
                                    <FaPlus className="mr-1" /> Add Slot
                                </button>
                            </div>

                            <div className="space-y-3 pl-4 border-l-2 border-gray-100">
                                {availability.map((slot, index) => {
                                    if (slot.dayOfWeek !== day.id) return null;
                                    return (
                                        <div key={index} className="flex items-center gap-4">
                                            <div className="flex items-center bg-gray-50 px-3 py-2 rounded-md">
                                                <FaClock className="text-gray-400 mr-2" />
                                                <input
                                                    type="time"
                                                    value={slot.startTime}
                                                    onChange={(e) => handleChangeSlot(index, 'startTime', e.target.value)}
                                                    className="bg-transparent outline-none text-gray-700 font-medium"
                                                />
                                                <span className="mx-2 text-gray-400">-</span>
                                                <input
                                                    type="time"
                                                    value={slot.endTime}
                                                    onChange={(e) => handleChangeSlot(index, 'endTime', e.target.value)}
                                                    className="bg-transparent outline-none text-gray-700 font-medium"
                                                />
                                            </div>
                                            <button
                                                onClick={() => handleRemoveSlot(index)}
                                                className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 transition"
                                                title="Remove slot"
                                            >
                                                <FaTrash />
                                            </button>
                                        </div>
                                    );
                                })}
                                {!availability.some(slot => slot.dayOfWeek === day.id) && (
                                    <p className="text-gray-400 italic text-sm">No availability set</p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default DoctorAvailability;
