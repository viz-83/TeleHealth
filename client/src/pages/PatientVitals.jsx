import React, { useState, useEffect } from 'react';
import axios from '../utils/axiosInstance';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import HealthMetricChart from '../components/HealthMetricChart';

const PatientVitals = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [metrics, setMetrics] = useState(null); // Object grouped by type
    const [loading, setLoading] = useState(true);
    const [patientName, setPatientName] = useState('Patient');

    useEffect(() => {
        const fetchVitals = async () => {
            try {
                const token = localStorage.getItem('token');
                const { data } = await axios.get(`http://localhost:5000/api/v1/health-metrics/patient/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                    withCredentials: true
                });

                if (data.status === 'success') {
                    setMetrics(data.data.metrics);
                }
            } catch (error) {
                console.error('Error fetching vitals:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchVitals();
    }, [id]);

    const MetricCard = ({ type, label, data, unit, color }) => {
        if (!data || data.length === 0) return null;

        const latest = data[data.length - 1]; // Sorted ASC, so last is latest
        const valDisplay = type === 'BLOOD_PRESSURE' ? `${latest.value.systolic}/${latest.value.diastolic}` : latest.value;

        return (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className={`p-4 border-b ${color} bg-opacity-10 flex justify-between items-center`}>
                    <h3 className={`font-bold ${color.replace('bg-', 'text-').replace('100', '700')}`}>{label}</h3>
                    <span className="text-sm text-gray-500">{new Date(latest.recordedAt).toLocaleDateString()}</span>
                </div>
                <div className="p-6">
                    <div className="text-3xl font-bold text-gray-800 mb-1">
                        {valDisplay} <span className="text-base text-gray-500 font-normal">{unit}</span>
                    </div>
                    {latest.isAbnormal && (
                        <span className="inline-block px-2 py-1 bg-red-100 text-red-700 text-xs font-bold rounded mb-4">Abnormal</span>
                    )}

                    <div className="mt-4 pt-4 border-t border-gray-50">
                        <h4 className="text-xs uppercase tracking-wide text-gray-400 font-semibold mb-2">History Trend</h4>
                        <div className="w-full h-32">
                            <HealthMetricChart data={data} metricType={type} />
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 py-8">
                <button onClick={() => navigate(-1)} className="mb-6 text-blue-600 hover:text-blue-800 font-medium">
                    &larr; Back to Dashboard
                </button>

                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">Patient Vitals & History</h1>
                </div>

                {loading ? (
                    <p className="text-center text-gray-500">Loading vitals...</p>
                ) : !metrics || Object.keys(metrics).length === 0 ? (
                    <div className="bg-white p-12 rounded-lg shadow text-center text-gray-500">
                        No health metrics recorded for this patient yet.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <MetricCard
                            type="GLUCOSE" label="Glucose" unit="mg/dL"
                            data={metrics.GLUCOSE} color="bg-green-100"
                        />
                        <MetricCard
                            type="BLOOD_PRESSURE" label="Blood Pressure" unit="mmHg"
                            data={metrics.BLOOD_PRESSURE} color="bg-red-100"
                        />
                        <MetricCard
                            type="HEART_RATE" label="Heart Rate" unit="bpm"
                            data={metrics.HEART_RATE} color="bg-pink-100"
                        />
                        <MetricCard
                            type="WEIGHT" label="Weight" unit="kg"
                            data={metrics.WEIGHT} color="bg-yellow-100"
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default PatientVitals;
