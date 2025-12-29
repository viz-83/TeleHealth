import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import axios from '../utils/axiosInstance';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';
import { useStreamSession } from '../context/StreamSessionContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';

const DoctorDashboard = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { setSession } = useStreamSession();

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const token = localStorage.getItem('token');
                const { data } = await axios.get('/v1/appointments/my', {
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
            const { data } = await axios.post('/v1/stream/token',
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
            toast.error(error.response?.data?.message || 'Failed to join video call');
        }
    };

    const handleOpenChat = async (appointmentId) => {
        try {
            const token = localStorage.getItem('token');
            const { data } = await axios.post('/v1/stream/token',
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
            toast.error(error.response?.data?.message || 'Failed to open chat');
        }
    };

    const getStatusVariant = (status) => {
        switch (status?.toLowerCase()) {
            case 'scheduled': return 'success';
            case 'completed': return 'default';
            case 'cancelled': return 'danger';
            case 'in_progress': return 'primary';
            default: return 'default';
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background-light flex flex-col font-body">
                <Navbar />
                <div className="flex-1 flex justify-center items-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cta"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background-light flex flex-col font-body">
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 py-8 w-full flex-1">
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-heading font-bold text-text-primary">Doctor Dashboard</h1>
                        <p className="text-text-secondary mt-1">Manage your appointments and patient interactions.</p>
                    </div>
                    <Button
                        onClick={() => navigate('/doctor/availability')}
                        variant="secondary"
                        className="whitespace-nowrap shadow-sm"
                    >
                        Manage Availability
                    </Button>
                </div>

                {appointments.length === 0 ? (
                    <div className="text-center py-20 bg-white dark:bg-surface rounded-3xl border border-dashed border-gray-100 dark:border-gray-700 shadow-sm">
                        <div className="text-6xl mb-4">📅</div>
                        <h3 className="text-xl font-bold text-text-primary">No appointments scheduled</h3>
                        <p className="text-text-secondary mt-2">Your upcoming appointments will appear here.</p>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {appointments.map((apt) => (
                            <Card key={apt._id} className="hover:shadow-lg transition-all duration-300 border border-gray-50 dark:border-white/5 overflow-hidden">
                                <div className="p-6">
                                    <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
                                        <div className="flex items-start md:items-center gap-4">
                                            <div className="w-14 h-14 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/40 dark:to-indigo-900/40 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-300 font-bold text-xl shadow-inner border border-blue-50 dark:border-blue-900/40">
                                                {apt.patient.name.charAt(0)}
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-heading font-bold text-text-primary">Patient: {apt.patient.name}</h3>
                                                <div className="flex flex-wrap gap-3 mt-1 text-sm text-text-secondary">
                                                    <span className="flex items-center">
                                                        <span className="mr-1">📅</span> {formatDate(apt.date)}
                                                    </span>
                                                    <span className="flex items-center">
                                                        <span className="mr-1">⏰</span> {apt.startTime} - {apt.endTime}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <Badge variant={getStatusVariant(apt.status)} className="capitalize px-3 py-1">
                                            {apt.status.replace('_', ' ').toLowerCase()}
                                        </Badge>
                                    </div>

                                    <div className="grid grid-cols-2 md:flex md:flex-wrap gap-3 pt-4 border-t border-gray-50 dark:border-white/5">
                                        <Button
                                            onClick={() => handleJoinVideo(apt._id)}
                                            disabled={apt.status === 'CANCELLED' || apt.status === 'COMPLETED'}
                                            className="w-full md:w-auto text-sm"
                                        >
                                            Start Call
                                        </Button>
                                        <Button
                                            variant="secondary"
                                            onClick={() => handleOpenChat(apt._id)}
                                            disabled={apt.status === 'CANCELLED'}
                                            className="w-full md:w-auto text-sm"
                                        >
                                            Chat
                                        </Button>
                                        <Button
                                            variant="outline"
                                            onClick={() => navigate(`/doctor/appointments/${apt._id}/prescribe`)}
                                            disabled={apt.status === 'CANCELLED'}
                                            className="w-full md:w-auto text-sm"
                                        >
                                            Prescribe
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            onClick={() => navigate(`/doctor/appointments/${apt._id}/prescription`)}
                                            className="w-full md:w-auto text-sm"
                                        >
                                            View Rx
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            onClick={() => navigate(`/doctor/patient/${apt.patient._id}/reports`)}
                                            className="w-full md:w-auto text-sm text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:text-purple-700"
                                        >
                                            Lab Reports
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            onClick={() => navigate(`/doctor/patient/${apt.patient._id}/vitals`)}
                                            className="w-full md:w-auto text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-700"
                                        >
                                            Vitals
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default DoctorDashboard;
