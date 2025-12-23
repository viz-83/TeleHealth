import React, { useEffect, useState } from 'react';
import axios from '../utils/axiosInstance';
import { useNavigate } from 'react-router-dom';
import { useStreamSession } from '../context/StreamSessionContext';
import Card from './ui/Card';
import Button from './ui/Button';
import Badge from './ui/Badge';

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
            alert('Failed to join video call. Please try again.');
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
            alert('Failed to open chat. Please try again.');
        }
    };

    const getStatusVariant = (status) => {
        switch (status) {
            case 'scheduled': return 'success';
            case 'completed': return 'default';
            case 'cancelled': return 'danger';
            case 'in_progress':
            case 'IN_PROGRESS': return 'primary'; // Using primary for active
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
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cta"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 px-2">
                <h2 className="text-2xl font-heading font-bold text-text-primary">My Appointments</h2>
                <Button
                    onClick={() => navigate('/patient/prescriptions')}
                    variant="secondary"
                    className="whitespace-nowrap"
                >
                    View Prescriptions
                </Button>
            </div>

            {appointments.length === 0 ? (
                <div className="text-center py-24 bg-white dark:bg-surface rounded-3xl border border-dashed border-gray-200 dark:border-gray-700">
                    <div className="text-6xl mb-6">📅</div>
                    <h3 className="text-xl font-bold text-text-primary mb-2">No appointments yet</h3>
                    <p className="text-text-secondary mb-8 max-w-sm mx-auto">Book your first consultation with a specialist today and take control of your health.</p>
                    <Button onClick={() => navigate('/find-doctors')} size="lg" className="shadow-lg shadow-cta/20">
                        Find a Doctor
                    </Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6">
                    {appointments.map((apt) => (
                        <Card key={apt._id} className="hover:shadow-lg transition-all duration-300 border border-gray-100 dark:border-gray-700 overflow-hidden">
                            <div className="p-6 sm:p-8 flex flex-col md:flex-row gap-6 md:gap-8 items-start md:items-center">
                                {/* Doctor Info */}
                                <div className="flex-1 flex items-start gap-4 w-full">
                                    <div className="w-16 h-16 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/40 dark:to-indigo-900/40 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-300 font-bold text-2xl shadow-inner">
                                        {apt.doctor.name.charAt(0)}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="text-xl font-heading font-bold text-text-primary">{apt.doctor.name}</h3>
                                                <p className="text-cta font-medium">{apt.doctor.specialization}</p>
                                                <p className="text-text-secondary text-sm mt-1">{apt.doctor.hospitalName}</p>
                                            </div>
                                            <Badge variant={getStatusVariant(apt.status)} className="capitalize md:hidden">
                                                {apt.status.replace('_', ' ').toLowerCase()}
                                            </Badge>
                                        </div>

                                        <div className="mt-4 flex flex-wrap gap-4 text-sm text-text-secondary">
                                            <div className="flex items-center px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm" style={{ backgroundColor: 'var(--bg-surface)' }}>
                                                <span className="mr-2">📅</span>
                                                <span className="font-medium text-text-primary">{formatDate(apt.date)}</span>
                                            </div>
                                            <div className="flex items-center px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm" style={{ backgroundColor: 'var(--bg-surface)' }}>
                                                <span className="mr-2">⏰</span>
                                                <span className="font-medium text-text-primary">{apt.startTime} - {apt.endTime}</span>
                                            </div>
                                            <div className="hidden md:block">
                                                <Badge variant={getStatusVariant(apt.status)} className="capitalize h-full flex items-center">
                                                    {apt.status.replace('_', ' ').toLowerCase()}
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-3 w-full md:w-auto pt-4 md:pt-0 border-t md:border-t-0 border-gray-50 dark:border-gray-700">
                                    <Button
                                        onClick={() => handleJoinVideo(apt._id)}
                                        disabled={apt.status === 'CANCELLED' || apt.status === 'completed'} // Assuming lowercase from backend generally, checking strict equality
                                        className="flex-1 md:flex-none whitespace-nowrap"
                                    >
                                        Join Call
                                    </Button>
                                    <Button
                                        variant="secondary"
                                        onClick={() => handleOpenChat(apt._id)}
                                        disabled={apt.status === 'CANCELLED'}
                                        className="flex-1 md:flex-none whitespace-nowrap"
                                    >
                                        Chat
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyAppointmentsSection;
