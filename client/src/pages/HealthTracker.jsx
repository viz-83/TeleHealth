import React, { useState, useEffect } from 'react';
import axios from '../utils/axiosInstance';
import Navbar from '../components/Navbar';
import HealthMetricChart from '../components/HealthMetricChart';

const HealthTracker = () => {
    const [activeTab, setActiveTab] = useState('GLUCOSE');
    const [metrics, setMetrics] = useState([]);
    const [loading, setLoading] = useState(false);

    // Form States
    const [value, setValue] = useState('');
    const [systolic, setSystolic] = useState('');
    const [diastolic, setDiastolic] = useState('');
    const [note, setNote] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const tabs = [
        { id: 'GLUCOSE', label: 'Glucose', unit: 'mg/dL', color: 'bg-green-100 text-green-700', icon: '🩸' },
        { id: 'BLOOD_PRESSURE', label: 'Blood Pressure', unit: 'mmHg', color: 'bg-red-100 text-red-700', icon: '❤️' },
        { id: 'HEART_RATE', label: 'Heart Rate', unit: 'bpm', color: 'bg-pink-100 text-pink-700', icon: '💓' },
        { id: 'WEIGHT', label: 'Weight', unit: 'kg', color: 'bg-yellow-100 text-yellow-700', icon: '⚖️' }
    ];

    const fetchMetrics = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const { data } = await axios.get('http://localhost:5000/api/v1/health-metrics/my', {
                params: { metricType: activeTab },
                headers: { Authorization: `Bearer ${token}` },
                withCredentials: true
            });
            if (data.status === 'success') {
                setMetrics(data.data.metrics);
            }
        } catch (error) {
            console.error('Error fetching metrics:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMetrics();
    }, [activeTab]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const token = localStorage.getItem('token');
            let payload = { metricType: activeTab, note };

            if (activeTab === 'BLOOD_PRESSURE') {
                payload.value = { systolic: Number(systolic), diastolic: Number(diastolic) };
            } else {
                payload.value = Number(value);
            }

            await axios.post('http://localhost:5000/api/v1/health-metrics', payload, {
                headers: { Authorization: `Bearer ${token}` },
                withCredentials: true
            });

            // Reset form and refresh
            setValue('');
            setSystolic('');
            setDiastolic('');
            setNote('');
            fetchMetrics();
        } catch (error) {
            console.error('Error logging metric:', error);
            alert('Failed to save reading. Please check your inputs.');
        } finally {
            setSubmitting(false);
        }
    };

    const getUnit = () => tabs.find(t => t.id === activeTab)?.unit;

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-8">My Health Tracker</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Input and Tabs */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Tabs */}
                        <div className="grid grid-cols-2 gap-3">
                            {tabs.map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`p-4 rounded-xl text-left transition ${activeTab === tab.id ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-100'}`}
                                >
                                    <span className="text-2xl mr-2">{tab.icon}</span>
                                    <span className="font-semibold">{tab.label}</span>
                                </button>
                            ))}
                        </div>

                        {/* Input Form */}
                        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                            <h2 className="text-xl font-bold text-gray-800 mb-4">Log {tabs.find(t => t.id === activeTab)?.label}</h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                {activeTab === 'BLOOD_PRESSURE' ? (
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Systolic</label>
                                            <input type="number" required value={systolic} onChange={e => setSystolic(e.target.value)} className="w-full p-3 border rounded-lg focus:ring-blue-500" placeholder="120" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Diastolic</label>
                                            <input type="number" required value={diastolic} onChange={e => setDiastolic(e.target.value)} className="w-full p-3 border rounded-lg focus:ring-blue-500" placeholder="80" />
                                        </div>
                                    </div>
                                ) : (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Value ({getUnit()})</label>
                                        <input type="number" step={activeTab === 'WEIGHT' ? '0.1' : '1'} required value={value} onChange={e => setValue(e.target.value)} className="w-full p-3 border rounded-lg focus:ring-blue-500" placeholder="Enter value..." />
                                    </div>
                                )}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Note (Optional)</label>
                                    <input type="text" value={note} onChange={e => setNote(e.target.value)} className="w-full p-3 border rounded-lg focus:ring-blue-500" placeholder="e.g. After breakfast" />
                                </div>
                                <button type="submit" disabled={submitting} className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-blue-300">
                                    {submitting ? 'Saving...' : 'Add Reading'}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Right Column: Chart and History */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Chart */}
                        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                            <h3 className="text-lg font-bold text-gray-800 mb-4">Trends</h3>
                            {metrics.length > 0 ? (
                                <HealthMetricChart data={metrics} metricType={activeTab} />
                            ) : (
                                <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg border border-dashed text-gray-400">
                                    No data available. Add your first reading!
                                </div>
                            )}
                        </div>

                        {/* Recent History */}
                        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                            <h3 className="text-lg font-bold text-gray-800 mb-4">Recent History</h3>
                            {metrics.length === 0 ? (
                                <p className="text-gray-500 text-center py-4">No records yet.</p>
                            ) : (
                                <div className="space-y-3">
                                    {/* Show only last 5 reversed */}
                                    {[...metrics].reverse().slice(0, 5).map(metric => (
                                        <div key={metric._id} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-semibold text-gray-800">
                                                        {metric.metricType === 'BLOOD_PRESSURE' && typeof metric.value === 'object'
                                                            ? `${metric.value.systolic}/${metric.value.diastolic}`
                                                            : (typeof metric.value === 'object' ? JSON.stringify(metric.value) : metric.value)} {getUnit()}
                                                    </span>
                                                    {metric.isAbnormal && (
                                                        <span className="px-2 py-0.5 bg-red-100 text-red-600 text-xs font-bold rounded-full">Abnormal</span>
                                                    )}
                                                </div>
                                                <p className="text-sm text-gray-500">{new Date(metric.recordedAt).toLocaleString()}</p>
                                            </div>
                                            {metric.note && (
                                                <span className="text-sm text-gray-600 bg-white px-3 py-1 rounded border border-gray-200">{metric.note}</span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HealthTracker;
