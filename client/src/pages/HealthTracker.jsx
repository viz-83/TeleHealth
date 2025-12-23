import React, { useState, useEffect } from 'react';
import axios from '../utils/axiosInstance';
import Navbar from '../components/Navbar';
import HealthMetricChart from '../components/HealthMetricChart';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Badge from '../components/ui/Badge';

const HealthTracker = () => {
    const [activeTab, setActiveTab] = useState('GLUCOSE');
    const [hoveredTab, setHoveredTab] = useState(null);
    const [metrics, setMetrics] = useState([]);
    const [loading, setLoading] = useState(false);

    // Form States
    const [value, setValue] = useState('');
    const [systolic, setSystolic] = useState('');
    const [diastolic, setDiastolic] = useState('');
    const [note, setNote] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const tabs = [
        { id: 'GLUCOSE', label: 'Glucose', unit: 'mg/dL', icon: '🩸' },
        { id: 'BLOOD_PRESSURE', label: 'Blood Pressure', unit: 'mmHg', icon: '❤️' },
        { id: 'HEART_RATE', label: 'Heart Rate', unit: 'bpm', icon: '💓' },
        { id: 'WEIGHT', label: 'Weight', unit: 'kg', icon: '⚖️' }
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
    const activeLabel = tabs.find(t => t.id === activeTab)?.label;

    return (
        <div className="min-h-screen bg-background-light flex flex-col font-body">
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 py-8 w-full flex-1">
                <h1 className="text-3xl font-heading font-bold text-text-primary mb-8 px-2">My Health Tracker</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Input and Tabs */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Tabs */}
                        <div className="grid grid-cols-2 gap-3">
                            {tabs.map(tab => {
                                const isHovered = hoveredTab === tab.id;
                                const isActive = activeTab === tab.id;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        onMouseEnter={() => setHoveredTab(tab.id)}
                                        onMouseLeave={() => setHoveredTab(null)}
                                        className={`
                                        p-4 rounded-xl text-left transition-all duration-200 border
                                        ${isActive
                                                ? 'bg-cta text-white shadow-lg shadow-cta/20 border-cta'
                                                : 'text-text-secondary border-gray-100 dark:border-gray-700'}
                                    `}
                                        style={{
                                            backgroundColor: isActive
                                                ? undefined
                                                : (isHovered ? 'var(--bg-subtle)' : 'var(--bg-surface)')
                                        }}
                                    >
                                        <span className="text-2xl mr-2">{tab.icon}</span>
                                        <span className={`font-semibold ${isActive ? 'text-white' : 'text-text-primary'}`}>
                                            {tab.label}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Input Form */}
                        <Card className="border border-gray-100 dark:border-gray-700 p-6 md:p-8">
                            <h2 className="text-xl font-heading font-bold text-text-primary mb-6">Log {activeLabel}</h2>
                            <form onSubmit={handleSubmit} className="space-y-5">
                                {activeTab === 'BLOOD_PRESSURE' ? (
                                    <div className="grid grid-cols-2 gap-4">
                                        <Input
                                            label="Systolic"
                                            type="number"
                                            placeholder="120"
                                            value={systolic}
                                            onChange={e => setSystolic(e.target.value)}
                                            required
                                        />
                                        <Input
                                            label="Diastolic"
                                            type="number"
                                            placeholder="80"
                                            value={diastolic}
                                            onChange={e => setDiastolic(e.target.value)}
                                            required
                                        />
                                    </div>
                                ) : (
                                    <Input
                                        label={`Value (${getUnit()})`}
                                        type="number"
                                        placeholder="Enter value..."
                                        step={activeTab === 'WEIGHT' ? '0.1' : '1'}
                                        value={value}
                                        onChange={e => setValue(e.target.value)}
                                        required
                                    />
                                )}
                                <Input
                                    label="Note (Optional)"
                                    type="text"
                                    placeholder="e.g. After breakfast"
                                    value={note}
                                    onChange={e => setNote(e.target.value)}
                                />
                                <Button
                                    type="submit"
                                    disabled={submitting}
                                    className="w-full"
                                >
                                    {submitting ? 'Saving...' : 'Add Reading'}
                                </Button>
                            </form>
                        </Card>
                    </div>

                    {/* Right Column: Chart and History */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Chart */}
                        <Card className="border border-gray-100 dark:border-gray-700 p-6 md:p-8">
                            <h3 className="text-lg font-heading font-bold text-text-primary mb-6">Trends</h3>
                            {metrics.length > 0 ? (
                                <div className="h-80 w-full">
                                    <HealthMetricChart data={metrics} metricType={activeTab} />
                                </div>
                            ) : (
                                <div className="h-64 flex flex-col items-center justify-center bg-gray-50 rounded-xl border border-dashed border-gray-200 text-text-muted">
                                    <div className="text-4xl mb-3">📈</div>
                                    <p>No data available yet.</p>
                                    <p className="text-sm mt-1">Add your first {activeLabel.toLowerCase()} reading!</p>
                                </div>
                            )}
                        </Card>

                        {/* Recent History */}
                        <Card className="border border-gray-100 dark:border-gray-700 p-6 md:p-8">
                            <h3 className="text-lg font-heading font-bold text-text-primary mb-6">Recent History</h3>
                            {metrics.length === 0 ? (
                                <p className="text-text-muted text-center py-4">No records yet.</p>
                            ) : (
                                <div className="space-y-3">
                                    {/* Show only last 5 reversed */}
                                    {[...metrics].reverse().slice(0, 5).map(metric => (
                                        <div key={metric._id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-gray-50 dark:bg-background-subtle rounded-xl border border-gray-100 dark:border-gray-700 hover:border-cta/20 transition-colors">
                                            <div className="mb-2 sm:mb-0">
                                                <div className="flex items-center gap-3">
                                                    <span className="font-heading font-bold text-lg text-text-primary">
                                                        {metric.metricType === 'BLOOD_PRESSURE' && typeof metric.value === 'object'
                                                            ? `${metric.value.systolic}/${metric.value.diastolic}`
                                                            : (typeof metric.value === 'object' ? JSON.stringify(metric.value) : metric.value)}
                                                        <span className="text-sm font-normal text-text-secondary ml-1">{getUnit()}</span>
                                                    </span>
                                                    {metric.isAbnormal && (
                                                        <Badge variant="danger">Abnormal</Badge>
                                                    )}
                                                </div>
                                                <p className="text-sm text-text-muted mt-1">{new Date(metric.recordedAt).toLocaleString()}</p>
                                            </div>
                                            {metric.note && (
                                                <span className="text-sm text-text-secondary bg-white dark:bg-surface px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700">
                                                    {metric.note}
                                                </span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HealthTracker;
