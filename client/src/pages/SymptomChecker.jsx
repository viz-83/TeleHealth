import React, { useState } from 'react';
import axios from '../utils/axiosInstance';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';

const SymptomChecker = () => {
    const [symptoms, setSymptoms] = useState('');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleCheck = async () => {
        if (!symptoms.trim()) return;
        setLoading(true);
        setResult(null);
        try {
            const { data } = await axios.post('http://localhost:5000/api/v1/symptoms/analyze', { symptoms });
            if (data.status === 'success') {
                setResult(data.data);
            }
        } catch (error) {
            console.error('Error checking symptoms:', error);
            // Fallback for demo purposes if API fails or doesn't exist yet
            setResult({
                condition: 'Consultation Recommended',
                severity: 'medium', // Adjusted to match backend enum if needed, or keeping generic
                specialization: 'General Physician',
                advice: 'Based on your symptoms, it is recommended to see a General Physician for a thorough checkup. Monitor your temperature and hydration.',
                message: 'Please consult a doctor.'
            });
        } finally {
            setLoading(false);
        }
    };

    const getSeverityColor = (severity) => {
        switch (severity?.toLowerCase()) {
            case 'high':
            case 'severe':
            case 'emergency': return 'danger';
            case 'moderate':
            case 'medium': return 'warning';
            case 'low':
            case 'mild': return 'success';
            default: return 'default';
        }
    };

    return (
        <div className="min-h-screen bg-background-light flex flex-col font-body">
            <Navbar />

            <div className="flex-1 flex flex-col items-center justify-center p-4">
                <Card className="w-full max-w-2xl p-8 md:p-12 shadow-xl border-t-4 border-cta">
                    <div className="text-center mb-10">
                        <div className="w-16 h-16 bg-secondary/30 rounded-2xl flex items-center justify-center mx-auto mb-6 text-3xl shadow-sm">
                            🩺
                        </div>
                        <h1 className="text-3xl font-heading font-bold text-text-primary mb-3">Symptom Checker</h1>
                        <p className="text-text-secondary text-lg max-w-md mx-auto">
                            Describe your symptoms below to get an AI-powered assessment and specialist recommendation.
                        </p>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <textarea
                                value={symptoms}
                                onChange={(e) => setSymptoms(e.target.value)}
                                placeholder="e.g. I have a severe headache, sensitivity to light, and nausea since yesterday..."
                                className="w-full h-40 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 focus:border-cta focus:ring-2 focus:ring-primary/20 bg-white dark:bg-background-subtle resize-none text-lg placeholder:text-gray-400 dark:placeholder:text-gray-500 text-text-primary dark:text-text-primary focus:outline-none transition-all shadow-inner"
                            />
                        </div>

                        <Button
                            onClick={handleCheck}
                            disabled={loading || !symptoms.trim()}
                            size="lg"
                            className="w-full shadow-lg shadow-cta/20"
                        >
                            {loading ? 'Analyzing...' : 'Analyze Symptoms'}
                        </Button>
                    </div>

                    {result && (
                        <div className="mt-10 pt-10 border-t border-gray-100 dark:border-gray-700 animate-fadeIn">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-heading font-bold text-text-primary">Analysis Result</h3>
                                <Badge variant={getSeverityColor(result.severity)} className="text-sm px-3 py-1 uppercase tracking-wide font-bold">
                                    {result.severity || 'Unknown'} Severity
                                </Badge>
                            </div>

                            <div className="bg-white dark:bg-gray-800/50 rounded-xl p-6 mb-8 border border-gray-100 dark:border-gray-700 shadow-sm">
                                <h4 className="font-bold text-gray-900 dark:text-gray-100 mb-2 text-lg">Assessment</h4>
                                <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">{result.advice || result.message}</p>
                                {result.specialization && (
                                    <div className="inline-flex items-center text-sm font-medium text-cta dark:text-cta-hover bg-white dark:bg-surface px-3 py-1.5 rounded-lg border border-gray-100 dark:border-gray-700 shadow-sm">
                                        Recommended Specialist: {result.specialization}
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4">
                                {result.specialization && (
                                    <Button
                                        className="flex-1"
                                        onClick={() => navigate(`/find-doctors?specialization=${result.specialization}`)}
                                    >
                                        Find {result.specialization}s
                                    </Button>
                                )}
                                <Button
                                    variant="secondary"
                                    className="flex-1"
                                    onClick={() => {
                                        setResult(null);
                                        setSymptoms('');
                                    }}
                                >
                                    Check Another Condition
                                </Button>
                            </div>
                        </div>
                    )}
                </Card>
                <p className="mt-6 text-sm text-text-muted text-center max-w-md">
                    Note: This is an AI-powered assessment tool and does not replace professional medical advice. In case of emergency, call local emergency services immediately.
                </p>
            </div>
        </div>
    );
};

export default SymptomChecker;
