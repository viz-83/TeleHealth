import React, { useEffect, useState } from 'react';
import axios from '../utils/axiosInstance';
import { useNavigate } from 'react-router-dom';
import { useStreamSession } from '../context/StreamSessionContext';

const MyAppointmentsSection = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { setSession } = useStreamSession();

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const token = localStorage.getItem('token');
                const { data } = await axios.get('http://localhost:5000/api/v1/appointments/my', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
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
            if (error.response && error.response.data && error.response.data.message) {
                alert(`Failed to join: ${error.response.data.message}`);
            } else {
                alert('Failed to join video call. Please try again.');
            }
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
            if (error.response && error.response.data && error.response.data.message) {
                alert(`Failed to open chat: ${error.response.data.message}`);
            } else {
                alert('Failed to open chat. Please try again.');
            }
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">My Appointments</h2>
                <button
                    onClick={() => navigate('/patient/prescriptions')}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition shadow-sm"
                >
                    View My Prescriptions
                </button>
            </div>

            {loading ? (
                <p className="text-center text-gray-500 py-8">Loading appointments...</p>
            ) : appointments.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                    <p className="text-gray-500 mb-4">You don't have any appointments yet.</p>
                    <button
                        onClick={() => navigate('/find-doctors')}
                        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
                    >
                        Find a Doctor
                    </button>
                </div>
            ) : (
                <div className="grid gap-6">
                    {appointments.map((apt) => (
                        <div key={apt._id} className="bg-white border border-gray-100 p-6 rounded-lg shadow-sm hover:shadow-md transition flex flex-col md:flex-row justify-between items-center">
                            <div className="mb-4 md:mb-0">
                                <h3 className="text-xl font-bold text-gray-800">{apt.doctor.name}</h3>
                                <p className="text-blue-600 font-medium">{apt.doctor.specialization}</p>
                                <p className="text-gray-600">{apt.doctor.hospitalName}</p>
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
                            <div className="flex space-x-3">
                                <button
                                    onClick={() => handleJoinVideo(apt._id)}
                                    disabled={apt.status === 'CANCELLED' || apt.status === 'COMPLETED'}
                                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
                                >
                                    Join Video Call
                                </button>
                                <button
                                    onClick={() => handleOpenChat(apt._id)}
                                    disabled={apt.status === 'CANCELLED'}
                                    className="px-4 py-2 border border-blue-600 text-blue-600 rounded hover:bg-blue-50 disabled:border-gray-300 disabled:text-gray-300 disabled:cursor-not-allowed transition"
                                >
                                    Open Chat
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyAppointmentsSection;
