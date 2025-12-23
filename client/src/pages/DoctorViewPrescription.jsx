import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../utils/axiosInstance';
import Navbar from '../components/Navbar';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { FaArrowLeft, FaFilePdf, FaUserMd, FaUser, FaCalendarAlt, FaPills, FaFlask, FaNotesMedical, FaCheckCircle } from 'react-icons/fa';

const DoctorViewPrescription = () => {
    const { id: appointmentId } = useParams();
    const navigate = useNavigate();
    const [prescription, setPrescription] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchPrescription = async () => {
            try {
                const token = localStorage.getItem('token');
                // Fetch prescription by appointment ID
                const { data } = await axios.get(`http://localhost:5000/api/v1/prescriptions/${appointmentId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                    withCredentials: true
                });

                if (data.status === 'success') {
                    setPrescription(data.data.prescription);
                }
            } catch (err) {
                console.error(err);
                if (err.response && err.response.status === 404) {
                    setError('No prescription found for this appointment.');
                } else {
                    setError('Failed to load prescription.');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchPrescription();
    }, [appointmentId]);

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
            <div className="flex-1 max-w-4xl mx-auto w-full p-4 md:p-8">
                <Button
                    variant="ghost"
                    onClick={() => navigate('/doctor/dashboard')}
                    className="mb-6 pl-0 hover:bg-transparent hover:text-cta"
                >
                    <FaArrowLeft className="mr-2" /> Back to Dashboard
                </Button>

                <div className="flex flex-col gap-6">
                    {loading ? (
                        <Card className="p-12 flex justify-center items-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cta"></div>
                        </Card>
                    ) : error ? (
                        <Card className="p-8 text-center border-red-100 dark:border-red-900/30 bg-red-50 dark:bg-red-900/10">
                            <p className="text-red-500 dark:text-red-400 text-lg mb-4 font-bold">{error}</p>
                            {error.includes('No prescription found') && (
                                <Button
                                    onClick={() => navigate(`/doctor/appointments/${appointmentId}/prescribe`)}
                                    size="lg"
                                >
                                    Create Prescription
                                </Button>
                            )}
                        </Card>
                    ) : prescription ? (
                        <Card className="overflow-hidden shadow-xl border-t-8 border-cta">
                            {/* Header */}
                            <div className="p-8 border-b border-gray-100 dark:border-gray-700 bg-gray-50/30 dark:bg-gray-800/30">
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                    <div>
                                        <h1 className="text-3xl font-heading font-bold text-text-primary mb-2">Prescription</h1>
                                        <div className="flex items-center text-text-secondary text-sm">
                                            <FaCalendarAlt className="mr-2" />
                                            <span>Issued on {formatDate(prescription.createdAt)}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Badge variant="success" className="px-3 py-1 flex items-center gap-2">
                                            <FaCheckCircle /> Verified
                                        </Badge>
                                    </div>
                                </div>
                            </div>

                            {/* Patient & Doctor Info */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8 border-b border-gray-100 dark:border-gray-700">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 text-xl">
                                        <FaUser />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-text-secondary uppercase tracking-wider">Patient</p>
                                        <p className="text-lg font-bold text-text-primary">{prescription.patient?.name || 'Unknown'}</p>
                                        <p className="text-text-secondary text-sm">{prescription.patient?.email}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400 text-xl">
                                        <FaUserMd />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-text-secondary uppercase tracking-wider">Doctor</p>
                                        <p className="text-lg font-bold text-text-primary">Dr. {prescription.doctor?.name || 'Unknown'}</p>
                                        <p className="text-text-secondary text-sm">General Practitioner</p>
                                    </div>
                                </div>
                            </div>

                            {/* Clinical Details */}
                            <div className="p-8 space-y-8">
                                {/* Diagnosis */}
                                <div>
                                    <h3 className="text-lg font-heading font-bold text-text-primary mb-3 flex items-center gap-2">
                                        <FaNotesMedical className="text-cta" /> Diagnosis
                                    </h3>
                                    <div className="bg-gray-50 dark:bg-gray-800/40 p-4 rounded-xl border border-gray-100 dark:border-gray-700 text-text-primary">
                                        {prescription.diagnosis || 'No diagnosis recorded.'}
                                    </div>
                                </div>

                                {/* Medicines */}
                                <div>
                                    <h3 className="text-lg font-heading font-bold text-text-primary mb-3 flex items-center gap-2">
                                        <FaPills className="text-cta" /> Medications
                                    </h3>
                                    {prescription.medicines && prescription.medicines.length > 0 ? (
                                        <div className="grid gap-3">
                                            {prescription.medicines.map((med, idx) => (
                                                <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white dark:bg-surface border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                                                    <div>
                                                        <p className="font-bold text-text-primary text-lg">{med.name}</p>
                                                        <p className="text-text-secondary text-sm flex flex-wrap gap-2 mt-1">
                                                            <span className="bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded text-xs">Dosage: {med.dosage}</span>
                                                            <span className="bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded text-xs">Freq: {med.frequency}</span>
                                                        </p>
                                                    </div>
                                                    <div className="mt-2 sm:mt-0 text-right">
                                                        <span className="text-sm font-bold text-cta bg-blue-50 dark:bg-blue-900/20 px-3 py-1 rounded-full">
                                                            {med.duration}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-text-muted italic">No medicines prescribed.</p>
                                    )}
                                </div>

                                {/* Tests */}
                                {prescription.tests && prescription.tests.length > 0 && (
                                    <div>
                                        <h3 className="text-lg font-heading font-bold text-text-primary mb-3 flex items-center gap-2">
                                            <FaFlask className="text-cta" /> Recommended Tests
                                        </h3>
                                        <div className="flex flex-wrap gap-2">
                                            {prescription.tests.map((test, idx) => (
                                                <Badge key={idx} variant="warning" className="px-3 py-1 text-sm">
                                                    {test}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Advice */}
                                {prescription.advice && (
                                    <div className="bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-100 dark:border-yellow-900/30 rounded-xl p-5">
                                        <h3 className="text-lg font-heading font-bold text-yellow-800 dark:text-yellow-200 mb-2">Additional Advice</h3>
                                        <p className="text-yellow-900 dark:text-yellow-100 leading-relaxed">
                                            {prescription.advice}
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="p-8 bg-gray-50 dark:bg-gray-800/20 border-t border-gray-100 dark:border-gray-700 flex justify-end gap-3">
                                <Button variant="outline" onClick={() => window.print()}>
                                    Print Prescription
                                </Button>
                                {/* Assuming we might have a PDF download later */}
                                {/* <Button>Download PDF</Button> */}
                            </div>
                        </Card>
                    ) : null}
                </div>
            </div>
        </div>
    );
};

export default DoctorViewPrescription;
