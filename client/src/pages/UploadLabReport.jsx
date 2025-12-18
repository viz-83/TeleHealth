import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';

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
            const { data } = await axios.get('http://localhost:5000/api/v1/reports/my', {
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
            const { data } = await axios.post('http://localhost:5000/api/v1/reports/upload', formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (data.status === 'success') {
                alert('Report uploaded successfully!');
                setFile(null);
                // Reset file input if valid
                document.getElementById('fileInput').value = '';
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
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">My Lab Reports</h1>
                    <button onClick={() => navigate('/dashboard')} className="text-blue-600 hover:text-blue-800">
                        &larr; Back to Dashboard
                    </button>
                </div>

                {/* Upload Section */}
                <div className="bg-white p-6 rounded-lg shadow mb-8">
                    <h2 className="text-lg font-semibold mb-4">Upload New Report</h2>
                    {error && <p className="text-red-500 mb-4">{error}</p>}
                    <form onSubmit={handleUpload} className="flex gap-4 items-end">
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Select File (PDF, Image)</label>
                            <input
                                id="fileInput"
                                type="file"
                                onChange={handleFileChange}
                                accept=".pdf,.png,.jpg,.jpeg"
                                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={uploading}
                            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:bg-blue-300"
                        >
                            {uploading ? 'Uploading...' : 'Upload'}
                        </button>
                    </form>
                </div>

                {/* List Section */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="px-6 py-4 border-b">
                        <h2 className="text-lg font-semibold text-gray-800">Uploaded Reports</h2>
                    </div>
                    {loading ? (
                        <p className="p-6 text-gray-500">Loading...</p>
                    ) : reports.length === 0 ? (
                        <p className="p-6 text-gray-500 text-center">No reports uploaded yet.</p>
                    ) : (
                        <ul className="divide-y divide-gray-200">
                            {reports.map((report) => (
                                <li key={report._id} className="p-6 flex justify-between items-center hover:bg-gray-50">
                                    <div className="flex items-center">
                                        <div className="mr-4">
                                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">{report.fileName}</p>
                                            <p className="text-sm text-gray-500">Uploaded on {new Date(report.uploadedAt).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <a
                                        href={`http://localhost:5000/api/v1/reports/download/${report._id}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                                    >
                                        View / Download
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

export default UploadLabReport;
