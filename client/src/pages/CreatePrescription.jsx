import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../utils/axiosInstance';
import Navbar from '../components/Navbar';

const CreatePrescription = () => {
    const { id: appointmentId } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [diagnosis, setDiagnosis] = useState('');
    const [medicines, setMedicines] = useState([]);
    const [tests, setTests] = useState([]);
    const [advice, setAdvice] = useState('');
    const [nextVisit, setNextVisit] = useState('');

    const [newMed, setNewMed] = useState({ name: '', dosage: '', frequency: '', duration: '' });
    const [newTest, setNewTest] = useState('');

    const handleAddMedicine = () => {
        if (!newMed.name || !newMed.dosage) return;
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
            // Check if user typed something but forgot to click Add
            if (newMed.name && newMed.dosage) {
                const confirmAdd = window.confirm('You have entered a medicine but not added it. Do you want to add it and proceed?');
                if (confirmAdd) {
                    medicines.push(newMed); // Modifying local var before verify, or better:
                    // Actually we can't modify const state.
                    // Let's just alert
                    setError('Please click "+ Add Medicine" to add the medicine to the list before saving.');
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
                alert('Prescription created successfully!');
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
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <h1 className="text-2xl font-bold text-gray-800 mb-6">Create Prescription</h1>

                    {error && (
                        <div className="mb-4 p-4 bg-red-100 border-l-4 border-red-500 text-red-700">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Diagnosis */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Diagnosis</label>
                            <textarea
                                value={diagnosis}
                                onChange={(e) => setDiagnosis(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                rows="3"
                                required
                                placeholder="Enter diagnosis..."
                            />
                        </div>

                        {/* Medicines */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Medicines</label>
                            <div className="space-y-3 mb-3">
                                {medicines.map((med, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded border">
                                        <span className="text-sm text-gray-800">
                                            <strong>{med.name}</strong> - {med.dosage} ({med.frequency}) for {med.duration}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveMedicine(idx)}
                                            className="text-red-500 hover:text-red-700 text-sm"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                ))}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
                                <input
                                    placeholder="Medicine Name"
                                    value={newMed.name}
                                    onChange={(e) => setNewMed({ ...newMed, name: e.target.value })}
                                    className="px-3 py-2 border rounded md:col-span-2"
                                />
                                <input
                                    placeholder="Dosage (e.g. 500mg)"
                                    value={newMed.dosage}
                                    onChange={(e) => setNewMed({ ...newMed, dosage: e.target.value })}
                                    className="px-3 py-2 border rounded"
                                />
                                <input
                                    placeholder="Frequency (e.g. 1-0-1)"
                                    value={newMed.frequency}
                                    onChange={(e) => setNewMed({ ...newMed, frequency: e.target.value })}
                                    className="px-3 py-2 border rounded"
                                />
                                <input
                                    placeholder="Duration (e.g. 5 days)"
                                    value={newMed.duration}
                                    onChange={(e) => setNewMed({ ...newMed, duration: e.target.value })}
                                    className="px-3 py-2 border rounded"
                                />
                            </div>
                            <button
                                type="button"
                                onClick={handleAddMedicine}
                                className="mt-2 text-sm text-blue-600 hover:text-blue-800 font-medium"
                            >
                                + Add Medicine
                            </button>
                        </div>

                        {/* Tests */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Recommended Tests</label>
                            <div className="space-y-2 mb-3">
                                {tests.map((test, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded border">
                                        <span className="text-sm">{test}</span>
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveTest(idx)}
                                            className="text-red-500 hover:text-red-700 text-sm"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                ))}
                            </div>
                            <div className="flex gap-2">
                                <input
                                    placeholder="Test Name (e.g. X-Ray)"
                                    value={newTest}
                                    onChange={(e) => setNewTest(e.target.value)}
                                    className="flex-1 px-3 py-2 border rounded"
                                />
                                <button
                                    type="button"
                                    onClick={handleAddTest}
                                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                                >
                                    Add
                                </button>
                            </div>
                        </div>

                        {/* Next Visit */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Next Visit (Optional)</label>
                            <input
                                type="date"
                                value={nextVisit}
                                onChange={(e) => setNextVisit(e.target.value)}
                                className="w-full md:w-1/3 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        {/* Advice */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Advice</label>
                            <textarea
                                value={advice}
                                onChange={(e) => setAdvice(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                rows="3"
                                placeholder="Any additional advice..."
                            />
                        </div>

                        <div className="flex justify-end pt-4">
                            <button
                                type="button"
                                onClick={() => navigate('/doctor/dashboard')}
                                className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-md mr-4 hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                            >
                                {loading ? 'Saving...' : 'Save Prescription'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreatePrescription;
