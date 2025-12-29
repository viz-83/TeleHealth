import React, { useState, useEffect } from 'react';
import axios from '../utils/axiosInstance';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { FaArrowLeft, FaCloudUploadAlt, FaFileAlt, FaTrash, FaCheckCircle, FaExternalLinkAlt } from 'react-icons/fa';

const UploadLabReport = () => {
    const navigate = useNavigate();
    const [file, setFile] = useState(null);
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchReports();
    }, []);

    const fetchReports = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const { data } = await axios.get('/v1/reports/my', {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (data.status === 'success') {
                setReports(data.data.reports);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file) {
            setError('Please select a file');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
            setUploading(true);
            setError('');
            const token = localStorage.getItem('token');
            const { data } = await axios.post('/v1/reports/upload', formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (data.status === 'success') {
                setFile(null);
                // Reset file input if valid
                const fileInput = document.getElementById('fileInput');
                if (fileInput) fileInput.value = '';
                fetchReports(); // Refresh list
            }
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Upload failed');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background-light flex flex-col font-body">
            <Navbar />
            <div className="flex-1 max-w-4xl mx-auto w-full p-4 md:p-8">
                <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                    <div>
                        <h1 className="text-3xl font-heading font-bold text-text-primary">My Lab Reports</h1>
                        <p className="text-text-secondary mt-1">Store and access your medical documents securely.</p>
                    </div>
                    <Button
                        variant="ghost"
                        onClick={() => navigate('/')}
                        className="hover:bg-transparent hover:text-cta pl-0 md:pl-4"
                    >
                        <FaArrowLeft className="mr-2" /> Back to Dashboard
                    </Button>
                </div>

                <div className="flex flex-col gap-8">
                    {/* Upload Section */}
                    <Card className="p-8 border-dashed border-2 border-cta/30 bg-secondary/10">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-secondary rounded-lg text-cta">
                                <FaCloudUploadAlt size={24} />
                            </div>
                            <h2 className="text-xl font-heading font-bold text-text-primary">Upload New Report</h2>
                        </div>

                        {error && (
                            <div className="mb-4 text-red-600 bg-red-50 p-3 rounded-lg border border-red-200 text-sm">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleUpload} className="flex flex-col md:flex-row gap-4 items-end">
                            <div className="flex-1 w-full">
                                <label className="block text-sm font-medium text-text-secondary mb-2">Select File (PDF, Image)</label>
                                <input
                                    id="fileInput"
                                    type="file"
                                    onChange={handleFileChange}
                                    accept=".pdf,.png,.jpg,.jpeg"
                                    className="block w-full text-sm text-text-secondary
                                    file:mr-4 file:py-2.5 file:px-4
                                    file:rounded-full file:border-0
                                    file:text-sm file:font-semibold
                                    file:bg-cta file:text-white
                                    hover:file:bg-cta-dark
                                    cursor-pointer bg-white border border-gray-200 rounded-lg"
                                />
                            </div>
                            <Button
                                type="submit"
                                isLoading={uploading}
                                className="w-full md:w-auto shadow-md"
                            >
                                Upload Report
                            </Button>
                        </form>
                    </Card>

                    {/* List Section */}
                    <div>
                        <h2 className="text-xl font-heading font-bold text-text-primary mb-4 flex items-center gap-2">
                            <FaFileAlt className="text-text-secondary" /> Uploaded Reports
                        </h2>

                        {loading ? (
                            <div className="flex justify-center py-10">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cta"></div>
                            </div>
                        ) : reports.length === 0 ? (
                            <Card className="p-12 text-center bg-gray-50 border-gray-50 shadow-none">
                                <p className="text-text-secondary">No reports uploaded yet.</p>
                            </Card>
                        ) : (
                            <div className="grid gap-4">
                                {reports.map((report) => (
                                    <Card key={report._id} className="hover:shadow-md transition-all border-gray-50">
                                        <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                            <div className="flex items-center gap-4">
                                                <div className="p-3 bg-secondary/20 rounded-xl text-text-secondary">
                                                    <FaFileAlt size={20} />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-text-primary">{report.fileName}</p>
                                                    <p className="text-xs text-text-secondary">
                                                        Uploaded on {new Date(report.uploadedAt).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <a
                                                    href={`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/v1/reports/download/${report._id}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    <Button variant="outline" size="sm">
                                                        <FaExternalLinkAlt className="mr-2" /> View
                                                    </Button>
                                                </a>
                                            </div>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UploadLabReport;
