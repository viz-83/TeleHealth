import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';
import { useStreamSession } from '../context/StreamSessionContext';

const DoctorDashboard = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { setSession } = useStreamSession();

    useEffect(() => {
        // Note: Ideally we would have a specific endpoint for doctor's appointments
        // For now, we'll reuse the 'my appointments' endpoint if the backend supports it for doctors too,
        // or we might need to add a specific one. Assuming 'getMyAppointments' works for the logged-in user regardless of role.
        const fetchAppointments = async () => {
            try {
                const token = localStorage.getItem('token');
                const { data } = await axios.get('http://localhost:5000/api/v1/appointments/my', {
                    headers: { Authorization: `Bearer ${token}` },
                    withCredentials: true
                });
                if (data.status === 'success') {
                    setAppointments(data.data.appointments);
                }
            } catch (error) {
                console.error('Error fetching appointments:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAppointments();
    }, []);

    const handleJoinVideo = async (appointmentId) => {
        try {
            const token = localStorage.getItem('token');
            const { data } = await axios.post('http://localhost:5000/api/v1/stream/token',
                { appointmentId, purpose: 'video' },
                {
                    headers: { Authorization: `Bearer ${token}` },
                    withCredentials: true
                }
            );

            if (data.status === 'success') {
                setSession(data.data);
                navigate(`/appointments/${appointmentId}/call`);
            }
        } catch (error) {
            console.error('Error joining video:', error);
            alert(error.response?.data?.message || 'Failed to join video call');
        }
    };

    const handleOpenChat = async (appointmentId) => {
        try {
            const token = localStorage.getItem('token');
            const { data } = await axios.post('http://localhost:5000/api/v1/stream/token',
                { appointmentId, purpose: 'chat' },
                {
                    headers: { Authorization: `Bearer ${token}` },
                    withCredentials: true
                }
            );

            if (data.status === 'success') {
                setSession(data.data);
                navigate(`/appointments/${appointmentId}/chat`);
            }
        } catch (error) {
            console.error('Error opening chat:', error);
            alert(error.response?.data?.message || 'Failed to open chat');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">Doctor Dashboard</h1>
                    <button
                        onClick={() => navigate('/doctor/availability')}
                        className="px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition shadow-sm font-medium"
                    >
                        Manage Availability
                    </button>
                </div>

                {loading ? (
                    <p className="text-center text-gray-500">Loading schedule...</p>
                ) : appointments.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-lg shadow">
                        <p className="text-gray-500">No appointments scheduled.</p>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {appointments.map((apt) => (
                            <div key={apt._id} className="bg-white p-6 rounded-lg shadow-md flex flex-col md:flex-row justify-between items-center">
                                <div className="mb-4 md:mb-0">
                                    <h3 className="text-xl font-bold text-gray-800">Patient: {apt.patient.name}</h3>
                                    <div className="mt-2 text-sm text-gray-500">
                                        <p>📅 {new Date(apt.date).toLocaleDateString()}</p>
                                        <p>⏰ {apt.startTime} - {apt.endTime}</p>
                                        <p className={`font-bold mt-1 ${apt.status === 'COMPLETED' ? 'text-green-600' :
                                            apt.status === 'CANCELLED' ? 'text-red-600' :
                                                apt.status === 'IN_PROGRESS' ? 'text-blue-600' :
                                                    'text-yellow-600'
                                            }`}>
                                            Status: {apt.status.replace('_', ' ')}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-3">
                                    <button
                                        onClick={() => handleJoinVideo(apt._id)}
                                        disabled={apt.status === 'CANCELLED' || apt.status === 'COMPLETED'}
                                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                                    >
                                        Start Consultation
                                    </button>
                                    <button
                                        onClick={() => handleOpenChat(apt._id)}
                                        disabled={apt.status === 'CANCELLED'}
                                        className="px-4 py-2 border border-blue-600 text-blue-600 rounded hover:bg-blue-50 disabled:border-gray-300 disabled:text-gray-300 disabled:cursor-not-allowed"
                                    >
                                        Open Chat
                                    </button>
                                    <button
                                        onClick={() => navigate(`/doctor/appointments/${apt._id}/prescribe`)}
                                        disabled={apt.status === 'CANCELLED'}
                                        className="px-4 py-2 border border-green-600 text-green-600 rounded hover:bg-green-50 disabled:border-gray-300 disabled:text-gray-300 disabled:cursor-not-allowed"
                                    >
                                        Prescribe
                                    </button>
                                    <button
                                        onClick={() => navigate(`/doctor/appointments/${apt._id}/prescription`)}
                                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-100"
                                    >
                                        View Prescription
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default DoctorDashboard;
