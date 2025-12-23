import React, { useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { useTestCart } from '../context/TestCartContext';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, ShoppingCart, Plus, Check } from 'lucide-react';

const Tests = () => {
    const [tests, setTests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [hoveredCategory, setHoveredCategory] = useState(null);

    const { addToCart, cart } = useTestCart();
    const navigate = useNavigate();

    const categories = ['All', 'Blood Test', 'Diabetes', 'Thyroid', 'Heart', 'Women Health', 'Full Body'];

    useEffect(() => {
        fetchTests();
    }, []);

    const fetchTests = async () => {
        try {
            const res = await axiosInstance.get('/api/v1/tests');
            if (res.data.status === 'success') {
                setTests(res.data.data.tests);
            }
        } catch (error) {
            console.error("Error fetching tests:", error);
        } finally {
            setLoading(false);
        }
    };

    const filteredTests = tests.filter(test => {
        const matchesCategory = selectedCategory === 'All' || test.category === selectedCategory;
        const matchesSearch = test.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            test.description.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const isInCart = (testId) => {
        return cart.some(item => item._id === testId);
    };

    return (
        <div className="min-h-screen bg-background-light py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-text-primary">Book Lab Tests at Home</h1>
                        <p className="mt-2 text-text-secondary">Certified labs, safe home collection, digital reports.</p>
                    </div>

                    <button
                        onClick={() => navigate('/tests/cart')}
                        className="mt-4 md:mt-0 relative inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700 shadow-sm transition-colors duration-200"
                    >
                        <ShoppingCart className="h-5 w-5 mr-2" />
                        View Cart
                        {cart.length > 0 && (
                            <span className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-red-500 flex items-center justify-center text-xs font-bold text-white border-2 border-white">
                                {cart.length}
                            </span>
                        )}
                    </button>
                </div>

                {/* Search and Filter */}
                <div className="bg-white dark:bg-surface rounded-lg shadow-sm p-4 mb-8">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-grow">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-800 placeholder-gray-500 dark:placeholder-gray-400 text-text-primary focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                                placeholder="Search for tests (e.g. Thyroid, CBC)..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                style={{ backgroundColor: 'var(--bg-surface)', color: 'var(--txt-primary)' }}
                            />
                        </div>
                        <div className="flex overflow-x-auto pb-2 md:pb-0 gap-2 no-scrollbar">
                            {categories.map(category => {
                                const isHovered = hoveredCategory === category;
                                const isActive = selectedCategory === category;
                                return (
                                    <button
                                        key={category}
                                        onClick={() => setSelectedCategory(category)}
                                        onMouseEnter={() => setHoveredCategory(category)}
                                        onMouseLeave={() => setHoveredCategory(null)}
                                        className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 border ${isActive
                                            ? 'bg-teal-600 text-white border-teal-600'
                                            : 'text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700'
                                            }`}
                                        style={{
                                            backgroundColor: isActive
                                                ? undefined
                                                : (isHovered ? 'var(--bg-subtle)' : 'var(--bg-surface)'),
                                            color: isActive ? '#ffffff' : 'var(--txt-primary)'
                                        }}
                                    >
                                        {category}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Test Grid */}
                {loading ? (
                    <div className="text-center py-12">
                        <div className="spinner-border text-teal-600 h-8 w-8 mx-auto" role="status"></div>
                        <p className="mt-2 text-gray-500">Loading tests...</p>
                    </div>
                ) : filteredTests.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredTests.map((test) => (
                            <div key={test._id} className="bg-white dark:bg-surface rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 dark:border-gray-700 flex flex-col h-full">
                                <div className="p-6 flex-grow">
                                    <div className="flex justify-between items-start">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                            {test.category}
                                        </span>
                                        {test.fastingRequired && (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                                                Fasting Required
                                            </span>
                                        )}
                                    </div>

                                    <h3 className="mt-4 text-lg font-semibold text-text-primary">{test.name}</h3>
                                    <p className="mt-2 text-sm text-text-secondary line-clamp-2">{test.description}</p>

                                    <div className="mt-4 flex items-center text-sm text-gray-500">
                                        <div className="flex items-center mr-4">
                                            <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                                            {test.sampleType} Sample
                                        </div>
                                    </div>
                                </div>
                                <div
                                    className="p-6 rounded-b-xl border-t border-gray-100 dark:border-gray-700 flex items-center justify-between"
                                    style={{ backgroundColor: 'var(--bg-subtle)' }}
                                >
                                    <div>
                                        <p className="text-xs text-text-muted">Total Cost</p>
                                        <p className="text-xl font-bold text-text-primary">₹{test.price}</p>
                                    </div>
                                    <button
                                        onClick={() => isInCart(test._id) ? navigate('/tests/cart') : addToCart(test)}
                                        className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 ${isInCart(test._id)
                                            ? 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500'
                                            : 'bg-white text-teal-600 border border-teal-600 hover:!bg-teal-50 dark:hover:!bg-teal-900/50 focus:ring-teal-500'
                                            }`}
                                    >
                                        {isInCart(test._id) ? (
                                            <>
                                                <Check className="h-4 w-4 mr-2" />
                                                In Cart
                                            </>
                                        ) : (
                                            <>
                                                <Plus className="h-4 w-4 mr-2" />
                                                Add
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                        <Filter className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900">No tests found</h3>
                        <p className="mt-1 text-gray-500">Try adjusting your search or category filter.</p>
                        <button
                            onClick={() => { setSearchTerm(''); setSelectedCategory('All'); }}
                            className="mt-4 text-teal-600 hover:text-teal-700 font-medium"
                        >
                            Clear all filters
                        </button>
                    </div>
                )}
            </div>

        </div>
    );
};

export default Tests;
