import React, { useEffect, useState } from 'react';
import axios from '../utils/axiosInstance';
import Navbar from '../components/Navbar';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { FaPrescriptionBottleAlt, FaUserMd, FaCalendarAlt, FaFilePdf, FaArrowLeft, FaEye } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const MyPrescriptions = () => {
    const [prescriptions, setPrescriptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPrescriptions = async () => {
            try {
                const token = localStorage.getItem('token');
                const { data } = await axios.get('/v1/prescriptions/my', {
                    headers: { Authorization: `Bearer ${token}` },
                    withCredentials: true
                });

                if (data.status === 'success') {
                    setPrescriptions(data.data.prescriptions);
                }
            } catch (err) {
                console.error(err);
                setError('Failed to load prescriptions');
            } finally {
                setLoading(false);
            }
        };

        fetchPrescriptions();
    }, []);

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div className="min-h-screen bg-background-light flex flex-col font-body">
            <Navbar />
            <div className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-8">
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-heading font-bold text-text-primary">My Prescriptions</h1>
                        <p className="text-text-secondary mt-1">View and download your medical prescriptions.</p>
                    </div>
                    <Button
                        variant="ghost"
                        onClick={() => navigate('/')}
                        className="hover:!bg-transparent dark:hover:!bg-transparent hover:text-cta pl-0 md:pl-4"
                    >
                        <FaArrowLeft className="mr-2" /> Back to Dashboard
                    </Button>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cta"></div>
                    </div>
                ) : error ? (
                    <div className="bg-red-50 dark:bg-red-900/10 text-red-700 dark:text-red-400 p-4 rounded-xl border border-red-200 dark:border-red-900/30 text-center shadow-sm">
                        {error}
                    </div>
                ) : prescriptions.length === 0 ? (
                    <div className="bg-white dark:bg-surface rounded-3xl p-12 text-center border border-dashed border-gray-50 dark:border-white/5">
                        <div className="text-5xl mb-4 text-gray-300">💊</div>
                        <h3 className="text-xl font-bold text-text-primary">No prescriptions found</h3>
                        <p className="text-text-secondary mt-2">You haven't received any prescriptions yet.</p>
                    </div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {prescriptions.map((script) => (
                            <Card key={script._id} className="hover:shadow-lg transition-all duration-300 border border-gray-50 dark:border-white/5 flex flex-col h-full">
                                <div className="p-6 flex-1">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-cta">
                                            <FaPrescriptionBottleAlt size={24} />
                                        </div>
                                        <Badge variant="success" className="text-xs">Issued</Badge>
                                    </div>

                                    <div className="mb-4">
                                        <h3 className="font-heading font-bold text-xl text-text-primary mb-1">
                                            {script.diagnosis || 'General Consultation'}
                                        </h3>
                                        <p className="text-sm text-text-secondary flex items-center gap-2">
                                            <FaCalendarAlt size={12} /> {formatDate(script.createdAt)}
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-3 mb-6 p-3 rounded-lg border border-gray-50 dark:border-white/5"
                                        style={{ backgroundColor: 'var(--bg-subtle)' }}
                                    >
                                        <div className="w-10 h-10 rounded-full flex items-center justify-center text-gray-400 dark:text-gray-500 shadow-sm border border-gray-50 dark:border-white/5"
                                            style={{ backgroundColor: 'var(--bg-surface)' }}
                                        >
                                            <FaUserMd />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-text-secondary uppercase">Prescribed By</p>
                                            <p className="text-sm font-bold text-text-primary">Dr. {script.doctor?.name || 'Unknown'}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-4 border-t border-gray-50 dark:border-white/5"
                                    style={{ backgroundColor: 'var(--bg-subtle)' }}
                                >
                                    {script.pdfUrl ? (
                                        <a
                                            href={`${(import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/api\/?$/, '')}${script.pdfUrl}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-full"
                                        >
                                            <Button className="w-full justify-center shadow-md shadow-cta/10">
                                                <FaFilePdf className="mr-2" /> View PDF
                                            </Button>
                                        </a>
                                    ) : (
                                        <Button disabled className="w-full justify-center opacity-50 cursor-not-allowed">
                                            Processing PDF...
                                        </Button>
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

export default MyPrescriptions;
