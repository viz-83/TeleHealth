import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../utils/axiosInstance';
import Navbar from '../components/Navbar';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Badge from '../components/ui/Badge';
import { FaPlus, FaTrash, FaPrescriptionBottleAlt, FaNotesMedical, FaCheck, FaTimes } from 'react-icons/fa';

const CreatePrescription = () => {
    const { id: appointmentId } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [diagnosis, setDiagnosis] = useState('');
    const [medicines, setMedicines] = useState([]);
    const [tests, setTests] = useState([]); // Array of strings
    const [advice, setAdvice] = useState('');
    const [nextVisit, setNextVisit] = useState('');

    const [newMed, setNewMed] = useState({ name: '', dosage: '', frequency: '', duration: '' });
    const [newTest, setNewTest] = useState('');

    const handleAddMedicine = () => {
        if (!newMed.name) return;
        setMedicines([...medicines, newMed]);
        setNewMed({ name: '', dosage: '', frequency: '', duration: '' });
    };

    const handleRemoveMedicine = (index) => {
        setMedicines(medicines.filter((_, i) => i !== index));
    };

    const handleAddTest = () => {
        if (!newTest) return;
        setTests([...tests, newTest]);
        setNewTest('');
    };

    const handleRemoveTest = (index) => {
        setTests(tests.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        if (medicines.length === 0) {
            if (newMed.name) {
                const confirmAdd = window.confirm('You have entered a medicine but not added it. Add it automatically?');
                if (confirmAdd) {
                    medicines.push(newMed);
                } else {
                    setError('Please add at least one medicine.');
                    setLoading(false);
                    return;
                }
            } else {
                setError('Please add at least one medicine.');
                setLoading(false);
                return;
            }
        }

        setError('');

        try {
            const token = localStorage.getItem('token');
            const payload = {
                appointmentId,
                diagnosis,
                medicines,
                tests,
                advice,
                nextVisit
            };

            const { data } = await axios.post('http://localhost:5000/api/v1/prescriptions', payload, {
                headers: { Authorization: `Bearer ${token}` },
                withCredentials: true
            });

            if (data.status === 'success') {
                navigate('/doctor/dashboard');
            }
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Failed to create prescription');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background-light flex flex-col font-body">
            <Navbar />
            <div className="flex-1 max-w-5xl mx-auto w-full p-4 md:p-8">
                <Card className="border-t-4 border-cta shadow-xl">
                    <div className="p-6 md:p-10">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                            <div>
                                <h1 className="text-3xl font-heading font-bold text-text-primary flex items-center gap-3">
                                    <span className="p-2 bg-blue-50 rounded-lg text-cta"><FaNotesMedical /></span>
                                    Create Prescription
                                </h1>
                                <p className="text-text-secondary mt-1 ml-14">Issue a digital prescription for your patient.</p>
                            </div>
                            <Button
                                variant="outline"
                                onClick={() => navigate('/doctor/dashboard')}
                                className="text-sm"
                            >
                                <FaTimes className="mr-2" /> Cancel
                            </Button>
                        </div>

                        {error && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center">
                                <span className="mr-2 text-xl">⚠️</span> {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-8">
                            {/* Diagnosis Section */}
                            <div className="space-y-4">
                                <h2 className="text-xl font-heading font-bold text-text-primary border-b border-gray-100 dark:border-gray-700 pb-2">1. Diagnosis</h2>
                                <textarea
                                    value={diagnosis}
                                    onChange={(e) => setDiagnosis(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 focus:border-cta focus:ring-2 focus:ring-cta/10 bg-gray-50/50 dark:bg-background-subtle transition-all outline-none min-h-[100px] text-text-primary"
                                    placeholder="Enter clinical diagnosis details..."
                                    required
                                />
                            </div>

                            {/* Medicines Section */}
                            <div className="space-y-4">
                                <h2 className="text-xl font-heading font-bold text-text-primary border-b border-gray-100 pb-2 flex justify-between items-center">
                                    <span>2. Medications</span>
                                    <Badge variant="primary">{medicines.length} Added</Badge>
                                </h2>

                                {/* Added Medicines List */}
                                {medicines.length > 0 && (
                                    <div className="grid gap-3 mb-4">
                                        {medicines.map((med, idx) => (
                                            <div key={idx} className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-blue-50/50 dark:bg-blue-900/10 rounded-xl border border-blue-100 dark:border-blue-900/30 gap-3">
                                                <div className="flex items-start gap-3">
                                                    <div className="mt-1 text-cta"><FaPrescriptionBottleAlt /></div>
                                                    <div>
                                                        <p className="font-bold text-text-primary text-lg">{med.name}</p>
                                                        <p className="text-text-secondary text-sm">
                                                            {med.dosage} • {med.frequency} • {med.duration}
                                                        </p>
                                                    </div>
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleRemoveMedicine(idx)}
                                                    className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-700 dark:hover:text-red-400 self-end md:self-auto"
                                                >
                                                    <FaTrash size={14} /> Remove
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Add New Medicine Form */}
                                <div className="p-5 bg-gray-50 dark:bg-gray-800/40 rounded-xl border border-gray-200 dark:border-gray-700 shadow-inner">
                                    <p className="text-sm font-bold text-text-secondary uppercase tracking-wider mb-3">Add New Medicine</p>
                                    <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                                        <div className="md:col-span-4">
                                            <Input
                                                placeholder="Medicine Name"
                                                value={newMed.name}
                                                onChange={(e) => setNewMed({ ...newMed, name: e.target.value })}
                                            />
                                        </div>
                                        <div className="md:col-span-2">
                                            <Input
                                                placeholder="Dosage (e.g. 500mg)"
                                                value={newMed.dosage}
                                                onChange={(e) => setNewMed({ ...newMed, dosage: e.target.value })}
                                            />
                                        </div>
                                        <div className="md:col-span-3">
                                            <Input
                                                placeholder="Frequency (e.g. 1-0-1)"
                                                value={newMed.frequency}
                                                onChange={(e) => setNewMed({ ...newMed, frequency: e.target.value })}
                                            />
                                        </div>
                                        <div className="md:col-span-3">
                                            <Input
                                                placeholder="Duration (e.g. 5 days)"
                                                value={newMed.duration}
                                                onChange={(e) => setNewMed({ ...newMed, duration: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <Button
                                        type="button"
                                        onClick={handleAddMedicine}
                                        variant="secondary"
                                        className="mt-3 w-full md:w-auto"
                                        disabled={!newMed.name}
                                    >
                                        <FaPlus className="mr-2" /> Add Medicine
                                    </Button>
                                </div>
                            </div>

                            {/* Tests Section */}
                            <div className="space-y-4">
                                <h2 className="text-xl font-heading font-bold text-text-primary border-b border-gray-100 pb-2">3. Recommended Tests</h2>
                                <div className="flex flex-wrap gap-2 mb-3">
                                    {tests.map((test, idx) => (
                                        <span key={idx} className="inline-flex items-center px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-900/10 text-purple-700 dark:text-purple-300 border border-purple-100 dark:border-purple-900/30 text-sm font-medium">
                                            {test}
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveTest(idx)}
                                                className="ml-2 text-purple-400 hover:text-purple-900 dark:hover:text-purple-200 focus:outline-none"
                                            >
                                                ×
                                            </button>
                                        </span>
                                    ))}
                                    {tests.length === 0 && <span className="text-text-muted italic text-sm py-1">No tests added yet.</span>}
                                </div>
                                <div className="flex gap-2 max-w-md">
                                    <div className="flex-1">
                                        <Input
                                            placeholder="Test Name (e.g. CBC, X-Ray)"
                                            value={newTest}
                                            onChange={(e) => setNewTest(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTest())}
                                        />
                                    </div>
                                    <Button
                                        type="button"
                                        onClick={handleAddTest}
                                        variant="secondary"
                                        disabled={!newTest}
                                    >
                                        Add
                                    </Button>
                                </div>
                            </div>

                            {/* Advice & Next Visit */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                                <div>
                                    <label className="block text-sm font-medium text-text-primary mb-2">Additional Advice</label>
                                    <textarea
                                        value={advice}
                                        onChange={(e) => setAdvice(e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 focus:border-cta focus:ring-2 focus:ring-cta/10 bg-gray-50/50 dark:bg-background-subtle transition-all outline-none min-h-[120px] text-text-primary"
                                        placeholder="Dietary instructions, rest, etc..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-text-primary mb-2">Next Follow-up Visit</label>
                                    <Input
                                        type="date"
                                        value={nextVisit}
                                        onChange={(e) => setNextVisit(e.target.value)}
                                    />
                                    <p className="text-xs text-text-muted mt-2">Leave blank if no follow-up is needed.</p>
                                </div>
                            </div>

                            <div className="pt-8 flex justify-end gap-4 border-t border-gray-100 dark:border-gray-700">
                                <Button
                                    type="submit"
                                    disabled={loading}
                                    size="lg"
                                    className="shadow-lg shadow-cta/20 w-full md:w-auto"
                                >
                                    {loading ? 'Processing...' : 'Issue Prescription'} <FaCheck className="ml-2" />
                                </Button>
                            </div>
                        </form>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default CreatePrescription;
