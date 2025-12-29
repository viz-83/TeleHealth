import React, { useState, useEffect } from 'react';
import axios from '../utils/axiosInstance';
import Navbar from '../components/Navbar';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
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
            const res = await axios.get('/v1/doctors/me', {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.data.data.doctor) {
                setAvailability(res.data.data.doctor.availabilitySlots || []);
            }
            setLoading(false);
        } catch (err) {
            console.error(err);
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
            await axios.post('/v1/doctors/me/availability', {
                availabilitySlots: availability
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSuccessMessage('Availability updated successfully!');
            setTimeout(() => setSuccessMessage(''), 3000);
            setSaving(false);
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Failed to update availability');
            setSaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-background-light flex flex-col font-body">
            <Navbar />
            <div className="flex-1 max-w-5xl mx-auto w-full p-4 md:p-8">
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-heading font-bold text-text-primary">Manage Availability</h1>
                        <p className="text-text-secondary mt-1">Set your weekly schedule for patient appointments.</p>
                    </div>
                    <Button
                        onClick={handleSave}
                        disabled={saving}
                        size="lg"
                        className="shadow-lg shadow-cta/20 flex items-center"
                    >
                        <FaSave className="mr-2" />
                        {saving ? 'Saving...' : 'Save Changes'}
                    </Button>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 flex items-center">
                        <span className="mr-2">⚠️</span> {error}
                    </div>
                )}

                {successMessage && (
                    <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl mb-6 flex items-center">
                        <span className="mr-2">✅</span> {successMessage}
                    </div>
                )}

                <div className="space-y-4">
                    {DAYS.map((day) => {
                        const daySlots = availability
                            .map((slot, idx) => ({ ...slot, originalIndex: idx }))
                            .filter(slot => slot.dayOfWeek === day.id);

                        const hasSlots = daySlots.length > 0;

                        return (
                            <Card key={day.id} className={`transition-all duration-200 ${hasSlots ? 'border-gray-200' : 'border-gray-100 bg-gray-50/50'}`}>
                                <div className="p-5 flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                                    <div className="md:w-1/4">
                                        <h3 className={`text-lg font-heading font-bold ${hasSlots ? 'text-text-primary' : 'text-text-secondary'}`}>
                                            {day.name}
                                        </h3>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleAddSlot(day.id)}
                                            className="mt-2 text-cta hover:bg-blue-50 pl-0 md:pl-2 justify-start"
                                        >
                                            <FaPlus className="mr-1" /> Add Slot
                                        </Button>
                                    </div>

                                    <div className="md:w-3/4 space-y-3">
                                        {hasSlots ? (
                                            daySlots.map((slot) => (
                                                <div key={slot.originalIndex} className="flex items-center gap-3 bg-white border border-gray-200 p-2 rounded-lg shadow-sm">
                                                    <div className="flex items-center flex-1 px-3 py-1 bg-gray-50 rounded text-text-primary font-medium">
                                                        <FaClock className="text-text-muted mr-3" />
                                                        <input
                                                            type="time"
                                                            value={slot.startTime}
                                                            onChange={(e) => handleChangeSlot(slot.originalIndex, 'startTime', e.target.value)}
                                                            className="bg-transparent outline-none cursor-pointer focus:text-cta transition-colors"
                                                        />
                                                        <span className="mx-3 text-gray-400 font-light">to</span>
                                                        <input
                                                            type="time"
                                                            value={slot.endTime}
                                                            onChange={(e) => handleChangeSlot(slot.originalIndex, 'endTime', e.target.value)}
                                                            className="bg-transparent outline-none cursor-pointer focus:text-cta transition-colors"
                                                        />
                                                    </div>
                                                    <button
                                                        onClick={() => handleRemoveSlot(slot.originalIndex)}
                                                        className="text-text-muted hover:text-red-500 p-2 rounded-lg hover:bg-red-50 transition"
                                                        title="Remove slot"
                                                    >
                                                        <FaTrash size={14} />
                                                    </button>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="h-full flex items-center py-2">
                                                <p className="text-text-muted text-sm italic">Unavailable</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </Card>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default DoctorAvailability;
