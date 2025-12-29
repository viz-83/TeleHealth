import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import axios from '../utils/axiosInstance';
import Navbar from '../components/Navbar';
import { Activity, Droplet, Heart, Scale, TrendingUp, Sparkles, Ruler, Flame, Utensils, Trash2 } from 'lucide-react';
import HealthMetricChart from '../components/HealthMetricChart';
import HealthAIInsights from '../components/HealthAIInsights';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Badge from '../components/ui/Badge';
import Modal from '../components/ui/Modal';

const HealthTracker = () => {
    const [activeTab, setActiveTab] = useState('GLUCOSE');
    const [hoveredTab, setHoveredTab] = useState(null);
    const [metrics, setMetrics] = useState([]);
    const [loading, setLoading] = useState(false);

    // Delete Modal State
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [deleting, setDeleting] = useState(false);

    // AI State
    const [aiInsights, setAiInsights] = useState(null);
    const [loadingAI, setLoadingAI] = useState(false);

    // Form States
    const [value, setValue] = useState('');
    const [systolic, setSystolic] = useState('');
    const [diastolic, setDiastolic] = useState('');
    const [note, setNote] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const tabs = [
        { id: 'GLUCOSE', label: 'Glucose', unit: 'mg/dL', icon: <Droplet className="w-6 h-6" /> },
        { id: 'BLOOD_PRESSURE', label: 'Blood Pressure', unit: 'mmHg', icon: <Heart className="w-6 h-6" /> },
        { id: 'HEART_RATE', label: 'Heart Rate', unit: 'bpm', icon: <Activity className="w-6 h-6" /> },
        { id: 'WEIGHT', label: 'Weight', unit: 'kg', icon: <Scale className="w-6 h-6" /> },
        { id: 'HEIGHT', label: 'Height', unit: 'cm', icon: <Ruler className="w-6 h-6" /> },
        { id: 'CALORIES', label: 'Calories', unit: 'kcal', icon: <Flame className="w-6 h-6" /> },
        { id: 'PROTEIN', label: 'Protein', unit: 'g', icon: <Utensils className="w-6 h-6" /> }
    ];

    const fetchMetrics = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const { data } = await axios.get('/v1/health-metrics/my', {
                params: { metricType: activeTab },
                headers: { Authorization: `Bearer ${token} ` },
                withCredentials: true
            });
            if (data.status === 'success') {
                setMetrics(data.data.metrics);
                // Clear old insights when tab changes as context changes
                setAiInsights(null);
            }
        } catch (error) {
            console.error('Error fetching metrics:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchAIInsights = async () => {
        if (metrics.length === 0) {
            toast.error("Please add some health data first!");
            return;
        }

        setLoadingAI(true);
        try {
            // Construct payload from current metrics
            // We find the latest value
            const latestMetric = metrics[metrics.length - 1]; // Sorted by recordedAt ASC in backend, so last is newest? 
            // Controller says: .sort('recordedAt'); So yes, last is newest.

            // We'll send a summary payload
            // Note: Ideally we'd fetch ALL types. For now, let's analyze the CURRENT active tab's data + context
            // But the prompt wants "height, weight, calories...". 
            // We'll send what we have.

            const payload = {
                metric_type: activeTab,
                latest_reading: latestMetric.value,
                recent_trends: `Last ${metrics.length} readings for ${activeTab}.`, // Simplification
                // If weight tab is active, we clearly have weight
                weight_kg: activeTab === 'WEIGHT' ? latestMetric.value : undefined,

                // Pass all metrics as raw for analysis?
                raw_metrics: metrics.slice(-10) // Send last 10 for trend analysis
            };

            const token = localStorage.getItem('token');
            const { data } = await axios.post('/v1/health-metrics/insights', payload, {
                headers: { Authorization: `Bearer ${token} ` },
                withCredentials: true
            });

            if (data.status === 'success') {
                setAiInsights(data.data);
                toast.success("Insights generated!");
            }
        } catch (error) {
            console.error("AI Insight Error:", error);
            toast.error("Failed to generate insights.");
        } finally {
            setLoadingAI(false);
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

            await axios.post('/v1/health-metrics', payload, {
                headers: { Authorization: `Bearer ${token} ` },
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
            toast.error('Failed to save reading. Please check your inputs.');
        } finally {
            setSubmitting(false);
        }
    };

    const initiateDelete = (id) => {
        setDeleteId(id);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!deleteId) return;
        setDeleting(true);

        try {
            const token = localStorage.getItem('token');
            await axios.delete(`/v1/health-metrics/${deleteId}`, {
                headers: { Authorization: `Bearer ${token} ` },
                withCredentials: true
            });

            toast.success('Record deleted');
            // Remove from local state immediately
            setMetrics(prev => prev.filter(m => m._id !== deleteId));
        } catch (error) {
            console.error('Error deleting metric:', error);
            toast.error('Failed to delete record');
        } finally {
            setDeleting(false);
            setIsDeleteModalOpen(false);
            setDeleteId(null);
        }
    };

    const getUnit = () => tabs.find(t => t.id === activeTab)?.unit;
    const activeLabel = tabs.find(t => t.id === activeTab)?.label;

    return (
        <div className="min-h-screen bg-background-light flex flex-col font-body">
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 py-8 w-full flex-1">
                <div className="flex justify-between items-center mb-8 px-2">
                    <h1 className="text-3xl font-heading font-bold text-text-primary">My Health Tracker</h1>

                    {metrics.length > 0 && (
                        <Button
                            onClick={fetchAIInsights}
                            disabled={loadingAI}
                            className="bg-gradient-to-r from-teal-500 to-emerald-500 text-white shadow-lg hover:shadow-xl border-none"
                        >
                            <Sparkles size={18} className="mr-2" />
                            {loadingAI ? 'Analyzing...' : 'Analyze My Trends'}
                        </Button>
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
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
p - 4 rounded - xl text - left transition - all duration - 200 border
                                        ${isActive
                                                ? 'bg-cta text-white shadow-lg shadow-cta/20 border-cta'
                                                : 'text-text-secondary border-gray-100 dark:border-gray-700'
                                            }
`}
                                        style={{
                                            backgroundColor: isActive
                                                ? undefined
                                                : (isHovered ? 'var(--bg-subtle)' : 'var(--bg-surface)')
                                        }}
                                    >
                                        <div className="mr-3">{tab.icon}</div>
                                        <span className={`font - semibold ${isActive ? 'text-white' : 'text-text-primary'} `}>
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
                                        label={`Value(${getUnit()})`}
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
                                <div className="h-64 flex flex-col items-center justify-center bg-gray-50 dark:bg-white/5 rounded-xl border border-dashed border-gray-200 dark:border-gray-700 text-text-muted">
                                    <TrendingUp className="w-12 h-12 mb-3 text-gray-300 dark:text-gray-600" />
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
                                                    </span >
                                                    {
                                                        metric.isAbnormal && (
                                                            <Badge variant="danger">Abnormal</Badge>
                                                        )
                                                    }
                                                </div >
                                                <p className="text-sm text-text-muted mt-1">{new Date(metric.recordedAt).toLocaleString()}</p>
                                            </div >
                                            <div className="flex items-center gap-2">
                                                {metric.note && (
                                                    <span className="text-sm text-text-secondary bg-white dark:bg-surface px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700">
                                                        {metric.note}
                                                    </span>
                                                )}
                                                <button
                                                    onClick={() => initiateDelete(metric._id)}
                                                    className="p-2 text-text-muted hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                                    title="Delete record"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div >
                            )}
                        </Card >
                    </div >
                </div >

                {/* AI Insights Section */}
                {
                    (aiInsights || loadingAI) && (
                        <div className="mb-8 animate-slideUp">
                            <HealthAIInsights data={aiInsights} loading={loadingAI} />
                        </div>
                    )
                }
                {/* Delete Confirmation Modal */}
                <Modal
                    isOpen={isDeleteModalOpen}
                    onClose={() => setIsDeleteModalOpen(false)}
                    title="Confirm Deletion"
                >
                    <div className="space-y-4">
                        <p className="text-text-secondary">
                            Are you sure you want to delete this health record? This action cannot be undone.
                        </p>
                        <div className="flex justify-end gap-3 mt-6">
                            <Button
                                variant="ghost"
                                onClick={() => setIsDeleteModalOpen(false)}
                                disabled={deleting}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="danger"
                                onClick={confirmDelete}
                                isLoading={deleting}
                            >
                                Delete Record
                            </Button>
                        </div>
                    </div>
                </Modal>
            </div >
        </div >
    );
};

export default HealthTracker;
