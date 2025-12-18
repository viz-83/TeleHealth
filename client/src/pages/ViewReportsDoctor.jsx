import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { useParams, useNavigate } from 'react-router-dom';

const ViewReportsDoctor = () => {
    const { id: patientId } = useParams();
    const navigate = useNavigate();
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const token = localStorage.getItem('token');
                const { data } = await axios.get(`http://localhost:5000/api/v1/reports/patient/${patientId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (data.status === 'success') {
                    setReports(data.data.reports);
                }
            } catch (err) {
                console.error(err);
                setError('Failed to fetch reports');
            } finally {
                setLoading(false);
            }
        };

        fetchReports();
    }, [patientId]);

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="max-w-4xl mx-auto px-4 py-8">
                <button
                    onClick={() => navigate(-1)}
                    className="mb-6 px-4 py-2 bg-gray-200 rounded text-gray-700 hover:bg-gray-300"
                >
                    &larr; Back
                </button>

                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="px-6 py-4 border-b bg-blue-50">
                        <h2 className="text-xl font-bold text-gray-800">Patient Lab Reports</h2>
                    </div>

                    {loading ? (
                        <div className="p-8 text-center text-gray-500">Loading reports...</div>
                    ) : error ? (
                        <div className="p-8 text-center text-red-500">{error}</div>
                    ) : reports.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">No reports found for this patient.</div>
                    ) : (
                        <ul className="divide-y divide-gray-200">
                            {reports.map((report) => (
                                <li key={report._id} className="p-6 flex justify-between items-center hover:bg-gray-50 transition">
                                    <div className="flex items-center">
                                        <div className="p-3 bg-blue-100 rounded-full mr-4 text-blue-600">
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-900">{report.fileName}</p>
                                            <p className="text-sm text-gray-500">
                                                Uploaded: {new Date(report.uploadedAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                    <a
                                        href={`http://localhost:5000/api/v1/reports/download/${report._id}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="px-4 py-2 bg-white border border-blue-600 text-blue-600 rounded hover:bg-blue-50 shadow-sm font-medium"
                                    >
                                        View Report
                                    </a>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ViewReportsDoctor;
