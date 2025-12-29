import React, { useEffect, useState } from 'react';
import axios from '../utils/axiosInstance';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { FaFilePdf, FaEye, FaArrowLeft } from 'react-icons/fa';

const DoctorPrescriptions = () => {
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
                        <h1 className="text-3xl font-heading font-bold text-text-primary">Issued Prescriptions</h1>
                        <p className="text-text-secondary mt-1">History of prescriptions issued by you.</p>
                    </div>
                    <Button
                        variant="secondary"
                        onClick={() => navigate('/doctor/dashboard')}
                        className="flex items-center"
                    >
                        <FaArrowLeft className="mr-2" /> Back to Dashboard
                    </Button>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cta"></div>
                    </div>
                ) : error ? (
                    <div className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-200">
                        {error}
                    </div>
                ) : prescriptions.length === 0 ? (
                    <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-gray-200">
                        <div className="text-5xl mb-4 text-gray-300">📝</div>
                        <h3 className="text-xl font-bold text-text-primary">No prescriptions issued</h3>
                        <p className="text-text-secondary mt-2">Any prescriptions you create will appear here.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {prescriptions.map((script) => (
                            <Card key={script._id} className="hover:shadow-lg transition-all duration-300 flex flex-col h-full border-gray-100">
                                <div className="p-6 flex flex-col h-full">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                                                {script.patient?.name?.charAt(0) || '?'}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-text-primary">{script.patient?.name || 'Unknown User'}</h3>
                                                <p className="text-xs text-text-secondary">{formatDate(script.createdAt)}</p>
                                            </div>
                                        </div>
                                        <Badge variant="success" className="text-xs">Issued</Badge>
                                    </div>

                                    <div className="flex-1 mb-6">
                                        <p className="text-sm text-text-muted font-bold uppercase tracking-wider mb-1">Diagnosis</p>
                                        <p className="text-text-primary line-clamp-2 md:line-clamp-3">
                                            {script.diagnosis}
                                        </p>
                                    </div>

                                    <div className="mt-auto border-t border-gray-50 pt-4 flex gap-3">
                                        {script.pdfUrl && (
                                            <a
                                                href={`${(import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/api\/?$/, '')}${script.pdfUrl}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex-1"
                                            >
                                                <Button variant="primary" className="w-full text-sm">
                                                    <FaFilePdf className="mr-2" /> PDF
                                                </Button>
                                            </a>
                                        )}
                                        <Button
                                            variant="secondary"
                                            className="flex-1 text-sm"
                                            onClick={() => navigate(`/doctor/prescriptions/${script._id}`)} // Assuming detail view exist or we can make one
                                        >
                                            <FaEye className="mr-2" /> View
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

export default DoctorPrescriptions;
