import React, { useState, useEffect } from 'react';
import axios from '../utils/axiosInstance';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import HealthMetricChart from '../components/HealthMetricChart';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { FaArrowLeft, FaHeartbeat, FaWeight, FaTint, FaChartLine } from 'react-icons/fa';

const PatientVitals = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [metrics, setMetrics] = useState(null); // Object grouped by type
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchVitals = async () => {
            try {
                const token = localStorage.getItem('token');
                const { data } = await axios.get(`/v1/health-metrics/patient/${id}`, {
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

    const MetricCard = ({ type, label, data, unit, colorClass, icon: Icon }) => {
        if (!data || data.length === 0) return null;

        const latest = data[data.length - 1]; // Sorted ASC, so last is latest
        const valDisplay = type === 'BLOOD_PRESSURE' ? `${latest.value.systolic}/${latest.value.diastolic}` : latest.value;

        return (
            <Card className="hover:shadow-lg transition-all duration-300 border-gray-50 dark:border-white/5 overflow-hidden">
                <div className={`p-4 border-b border-gray-50 dark:border-white/5 flex justify-between items-center ${colorClass} bg-opacity-5 dark:bg-opacity-10`}>
                    <div className="flex items-center gap-2">
                        <div className={`p-2 rounded-lg ${colorClass} bg-opacity-20 text-gray-700 dark:text-gray-200`}>
                            {Icon && <Icon />}
                        </div>
                        <h3 className="font-heading font-bold text-text-primary">{label}</h3>
                    </div>
                    <span className="text-xs text-text-secondary font-medium bg-white dark:bg-surface px-2 py-1 rounded-md shadow-sm">
                        {new Date(latest.recordedAt).toLocaleDateString()}
                    </span>
                </div>
                <div className="p-6">
                    <div className="flex justify-between items-end mb-4">
                        <div className="text-4xl font-bold text-text-primary mb-1">
                            {valDisplay} <span className="text-lg text-text-secondary font-medium">{unit}</span>
                        </div>
                        {latest.isAbnormal && (
                            <Badge variant="danger">Abnormal</Badge>
                        )}
                    </div>

                    <div className="mt-6 pt-4 border-t border-gray-50 dark:border-gray-800">
                        <div className="flex items-center gap-2 mb-2">
                            <FaChartLine className="text-text-muted" />
                            <h4 className="text-xs uppercase tracking-wide text-text-muted font-bold">History Trend</h4>
                        </div>
                        <div className="w-full h-40">
                            <HealthMetricChart data={data} metricType={type} />
                        </div>
                    </div>
                </div>
            </Card>
        );
    };

    return (
        <div className="min-h-screen bg-background-light flex flex-col font-body">
            <Navbar />
            <div className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-8">
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-heading font-bold text-text-primary">Patient Vitals & History</h1>
                        <p className="text-text-secondary mt-1">Track patient health metrics and vital signs.</p>
                    </div>
                    <Button
                        variant="ghost"
                        onClick={() => navigate(-1)}
                        className="hover:bg-transparent hover:text-cta pl-0 md:pl-4"
                    >
                        <FaArrowLeft className="mr-2" /> Back to Dashboard
                    </Button>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cta"></div>
                    </div>
                ) : !metrics || Object.keys(metrics).length === 0 ? (
                    <div className="bg-white dark:bg-surface rounded-3xl p-12 text-center border border-dashed border-gray-200 dark:border-gray-700">
                        <div className="text-5xl mb-4 text-gray-300">📊</div>
                        <h3 className="text-xl font-bold text-text-primary">No health metrics recorded</h3>
                        <p className="text-text-secondary mt-2">This patient has not logged any health data yet.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                        <MetricCard
                            type="GLUCOSE" label="Glucose" unit="mg/dL"
                            data={metrics.GLUCOSE} colorClass="bg-green-500 text-green-700"
                            icon={FaTint}
                        />
                        <MetricCard
                            type="BLOOD_PRESSURE" label="Blood Pressure" unit="mmHg"
                            data={metrics.BLOOD_PRESSURE} colorClass="bg-red-500 text-red-700"
                            icon={FaHeartbeat}
                        />
                        <MetricCard
                            type="HEART_RATE" label="Heart Rate" unit="bpm"
                            data={metrics.HEART_RATE} colorClass="bg-pink-500 text-pink-700"
                            icon={FaHeartbeat}
                        />
                        <MetricCard
                            type="WEIGHT" label="Weight" unit="kg"
                            data={metrics.WEIGHT} colorClass="bg-yellow-500 text-yellow-700"
                            icon={FaWeight}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default PatientVitals;
