import React, { useState, useEffect } from 'react';
import axios from '../utils/axiosInstance';
import Navbar from '../components/Navbar';
import { useParams, useNavigate } from 'react-router-dom';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { FaArrowLeft, FaFileAlt, FaExternalLinkAlt, FaDownload } from 'react-icons/fa';

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
                const { data } = await axios.get(`/v1/reports/patient/${patientId}`, {
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
                <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                    <div>
                        <h1 className="text-3xl font-heading font-bold text-text-primary">Patient Lab Reports</h1>
                        <p className="text-text-secondary mt-1">View uploaded medical documents and test results.</p>
                    </div>
                    <Button
                        variant="ghost"
                        onClick={() => navigate(-1)}
                        className="hover:bg-transparent hover:text-cta pl-0 md:pl-4"
                    >
                        <FaArrowLeft className="mr-2" /> Back
                    </Button>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center py-12">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-cta"></div>
                    </div>
                ) : error ? (
                    <div className="bg-secondary/30 text-primary p-4 rounded-xl border border-secondary text-center">
                        {error}
                    </div>
                ) : reports.length === 0 ? (
                    <div className="bg-white dark:bg-surface rounded-3xl p-12 text-center border border-dashed border-secondary dark:border-white/5">
                        <div className="text-5xl mb-4 text-secondary">📂</div>
                        <h3 className="text-xl font-bold text-text-primary">No reports found</h3>
                        <p className="text-text-secondary mt-2">This patient has not uploaded any lab reports yet.</p>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {reports.map((report) => (
                            <Card key={report._id} className="hover:shadow-md transition-shadow border-gray-50 dark:border-white/5">
                                <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div className="flex items-start gap-4">
                                        <div className="p-3 bg-secondary/20 dark:bg-secondary/10 rounded-xl text-cta">
                                            <FaFileAlt size={24} />
                                        </div>
                                        <div>
                                            <p className="font-bold text-text-primary text-lg">{report.fileName}</p>
                                            <p className="text-sm text-text-secondary">
                                                Uploaded on {formatDate(report.uploadedAt)}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex gap-2 w-full sm:w-auto">
                                        <a
                                            href={`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/v1/reports/download/${report._id}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex-1 sm:flex-none"
                                        >
                                            <Button variant="secondary" className="w-full sm:w-auto text-sm">
                                                <FaExternalLinkAlt className="mr-2" /> View
                                            </Button>
                                        </a>
                                        {/* Optional Download Button if needed differently */}
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

export default ViewReportsDoctor;
