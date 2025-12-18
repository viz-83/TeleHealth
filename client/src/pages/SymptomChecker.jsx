import React, { useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';

const SymptomChecker = () => {
    const navigate = useNavigate();
    const [symptoms, setSymptoms] = useState('');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleAnalyze = async (e) => {
        e.preventDefault();
        if (!symptoms.trim()) {
            setError('Please describe your symptoms.');
            return;
        }

        setLoading(true);
        setError('');
        setResult(null);

        try {
            const { data } = await axios.post('http://localhost:5000/api/v1/symptoms/analyze', { symptoms });
            if (data.status === 'success') {
                setResult(data.data);
            }
        } catch (err) {
            console.error(err);
            setError('Failed to analyze symptoms. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const getSeverityColor = (severity) => {
        switch (severity) {
            case 'EMERGENCY': return 'bg-red-100 text-red-800 border-red-200';
            case 'HIGH': return 'bg-orange-100 text-orange-800 border-orange-200';
            case 'MEDIUM': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'LOW': return 'bg-green-100 text-green-800 border-green-200';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const handleFindDoctors = (specialization) => {
        navigate(`/find-doctors?specialization=${specialization}`);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="max-w-4xl mx-auto px-4 py-8">
                <button
                    onClick={() => navigate(-1)}
                    className="mb-6 text-blue-600 hover:text-blue-800 font-medium"
                >
                    &larr; Back
                </button>

                <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Symptom Checker</h1>
                    <p className="text-gray-600 mb-6">Describe your symptoms below to get instant AI-powered recommendations on which specialist to visit.</p>

                    <form onSubmit={handleAnalyze}>
                        <textarea
                            value={symptoms}
                            onChange={(e) => setSymptoms(e.target.value)}
                            placeholder="e.g. I have severe chest pain and shortage of breath..."
                            className="w-full h-32 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition resize-none mb-4"
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-3 rounded-lg text-white font-semibold text-lg transition duration-200 ${loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
                        >
                            {loading ? 'Analyzing...' : 'Analyze Symptoms'}
                        </button>
                    </form>
                    {error && <p className="mt-4 text-red-500 text-center">{error}</p>}
                </div>

                {result && (
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden animate-fade-in-up">
                        <div className={`p-6 border-b ${result.emergencyCareRequired ? 'bg-red-50' : 'bg-gray-50'}`}>
                            <div className="flex justify-between items-start">
                                <div>
                                    <h2 className="text-xl font-bold text-gray-800 mb-1">Analysis Result</h2>
                                    <p className="text-gray-600">Based on your input</p>
                                </div>
                                <span className={`px-4 py-1 rounded-full text-sm font-bold border uppercase tracking-wide ${getSeverityColor(result.severity)}`}>
                                    {result.severity} Severity
                                </span>
                            </div>
                        </div>

                        <div className="p-8">
                            {result.emergencyCareRequired && (
                                <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-r">
                                    <div className="flex flex-col space-y-3 w-full">
                                        <div className="flex">
                                            <div className="flex-shrink-0">
                                                <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                            <div className="ml-3">
                                                <p className="text-sm text-red-700 font-bold">
                                                    {result.message}
                                                </p>
                                                <p className="text-sm text-red-600 mt-1">Please call emergency services or visit the nearest hospital.</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => navigate('/ambulance/book')}
                                            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded shadow-md transition flex items-center justify-center animate-pulse"
                                        >
                                            <span className="mr-2 text-2xl">🚑</span> BOOK AMBULANCE NOW
                                        </button>
                                    </div>
                                </div>
                            )}

                            {!result.emergencyCareRequired && (
                                <div className="mb-6 text-gray-700 bg-blue-50 p-4 rounded-lg border border-blue-100">
                                    <p>{result.message}</p>
                                </div>
                            )}

                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">Suggested Specialists</h3>
                                <div className="grid gap-4 md:grid-cols-2">
                                    {result.suggestedSpecializations.map((spec, idx) => (
                                        <div key={idx} className="border rounded-lg p-4 hover:border-blue-500 transition group flex justify-between items-center bg-gray-50 hover:bg-white">
                                            <span className="font-medium text-gray-900">{spec}</span>
                                            <button
                                                onClick={() => handleFindDoctors(spec)}
                                                className="text-blue-600 text-sm font-semibold group-hover:underline"
                                            >
                                                Find Doctors &rarr;
                                            </button>

                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SymptomChecker;
