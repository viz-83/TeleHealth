import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../utils/axiosInstance';
import Navbar from '../components/Navbar';

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

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="max-w-4xl mx-auto px-4 py-8">
                <button
                    onClick={() => navigate('/doctor/dashboard')}
                    className="mb-6 px-4 py-2 text-gray-600 bg-gray-200 rounded hover:bg-gray-300"
                >
                    &larr; Back to Dashboard
                </button>

                <div className="bg-white rounded-lg shadow-lg p-8">
                    {loading ? (
                        <p className="text-gray-500">Loading prescription...</p>
                    ) : error ? (
                        <div className="text-center py-8">
                            <p className="text-red-500 text-lg mb-4">{error}</p>
                            {error.includes('No prescription found') && (
                                <button
                                    onClick={() => navigate(`/doctor/appointments/${appointmentId}/prescribe`)}
                                    className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                >
                                    Create Prescription
                                </button>
                            )}
                        </div>
                    ) : prescription ? (
                        <>
                            <div className="border-b pb-6 mb-6">
                                <h1 className="text-3xl font-bold text-gray-800">Prescription Details</h1>
                                <p className="text-gray-500 mt-1">Date: {new Date(prescription.createdAt).toLocaleDateString()}</p>
                            </div>

                            <div className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-blue-50 p-4 rounded-lg">
                                        <h3 className="text-sm font-semibold text-blue-800 uppercase tracking-wide mb-2">Patient Details</h3>
                                        <p className="text-lg font-medium text-gray-900">{prescription.patient?.name}</p>
                                        <p className="text-gray-600">{prescription.patient?.email}</p>
                                    </div>
                                    <div className="bg-green-50 p-4 rounded-lg">
                                        <h3 className="text-sm font-semibold text-green-800 uppercase tracking-wide mb-2">Doctor Details</h3>
                                        <p className="text-lg font-medium text-gray-900">Dr. {prescription.doctor?.name}</p>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-xl font-bold text-gray-800 border-b pb-2 mb-4">Diagnosis</h3>
                                    <div className="bg-gray-50 p-4 rounded border border-gray-200">
                                        <p className="text-gray-800 whitespace-pre-line">{prescription.diagnosis || 'No diagnosis recorded.'}</p>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-xl font-bold text-gray-800 border-b pb-2 mb-4">Medicines</h3>
                                    {prescription.medicines && prescription.medicines.length > 0 ? (
                                        <div className="overflow-hidden border border-gray-200 rounded-lg">
                                            <table className="min-w-full divide-y divide-gray-200">
                                                <thead className="bg-gray-50">
                                                    <tr>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Medicine</th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dosage</th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Freq</th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Duration</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="bg-white divide-y divide-gray-200">
                                                    {prescription.medicines.map((med, idx) => (
                                                        <tr key={idx}>
                                                            <td className="px-6 py-4 text-sm font-medium text-gray-900">{med.name}</td>
                                                            <td className="px-6 py-4 text-sm text-gray-500">{med.dosage}</td>
                                                            <td className="px-6 py-4 text-sm text-gray-500">{med.frequency}</td>
                                                            <td className="px-6 py-4 text-sm text-gray-500">{med.duration}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    ) : (
                                        <p className="text-gray-500 italic">No medicines prescribed.</p>
                                    )}
                                </div>

                                {prescription.tests && prescription.tests.length > 0 && (
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-800 border-b pb-2 mb-4">Recommended Tests</h3>
                                        <ul className="list-disc list-inside bg-gray-50 p-4 rounded border border-gray-200 text-gray-700">
                                            {prescription.tests.map((test, idx) => (
                                                <li key={idx} className="mb-1">{test}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                <div>
                                    <h3 className="text-xl font-bold text-gray-800 border-b pb-2 mb-4">Advice</h3>
                                    <div className="bg-yellow-50 p-4 rounded border border-yellow-200">
                                        <p className="text-gray-800 whitespace-pre-line">{prescription.advice || 'No advice recorded.'}</p>
                                    </div>
                                </div>
                            </div>

                        </>
                    ) : null}
                </div>
            </div>
        </div>
    );
};

export default DoctorViewPrescription;
