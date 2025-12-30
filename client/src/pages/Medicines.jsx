import { useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { useMedicineCart } from '../context/MedicineCartContext';
import { Search, Filter, ShoppingCart, Plus, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Skeleton from '../components/ui/Skeleton';

const Medicines = () => {
    const [medicines, setMedicines] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');
    const [hoveredCategory, setHoveredCategory] = useState(null);
    const [isCartHovered, setIsCartHovered] = useState(false);

    const { addToCart, cart } = useMedicineCart();
    const navigate = useNavigate();

    const categories = ["All", "Tablets", "Syrups", "OTC", "Chronic Care", "Vitamins & Supplements", "First Aid"];

    useEffect(() => {
        fetchMedicines();
    }, [searchTerm, activeCategory]);

    const fetchMedicines = async () => {
        try {
            setLoading(true);
            let query = '/v1/medicines?isActive=true';

            if (searchTerm) {
                query += `&search=${searchTerm}`;
            }
            if (activeCategory !== 'All') {
                query += `&category=${activeCategory}`;
            }

            const response = await axiosInstance.get(query);
            setMedicines(response.data.data.medicines);
        } catch (error) {
            console.error('Error fetching medicines:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background-light py-8 px-4 sm:px-6 lg:px-8 pb-20">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-text-primary">Online Pharmacy</h1>
                        <p className="mt-2 text-text-secondary">Genuine medicines, fast delivery, trusted brands.</p>
                    </div>

                    <button
                        onClick={() => navigate('/Medicines/cart')}
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
                                className="block w-full pl-10 pr-3 py-2 border border-gray-50 dark:border-white/10 rounded-md leading-5 bg-white dark:bg-gray-800 placeholder-gray-500 dark:placeholder-gray-400 text-text-primary focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                                placeholder="Search for medicines (e.g. Paracetamol, Syrup)..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                style={{ backgroundColor: 'var(--bg-surface)', color: 'var(--txt-primary)' }}
                            />
                        </div>
                        <div className="flex overflow-x-auto pb-2 md:pb-0 gap-2 no-scrollbar">
                            {categories.map(category => {
                                const isHovered = hoveredCategory === category;
                                const isActive = activeCategory === category;
                                return (
                                    <button
                                        key={category}
                                        onClick={() => setActiveCategory(category)}
                                        onMouseEnter={() => setHoveredCategory(category)}
                                        onMouseLeave={() => setHoveredCategory(null)}
                                        className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 border ${isActive
                                            ? 'bg-teal-600 text-white border-teal-600'
                                            : 'text-gray-600 dark:text-gray-300 border-gray-50 dark:border-white/10'
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

                {/* Medicine Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                            <div key={i} className="bg-white dark:bg-surface rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-white/5 flex flex-col h-full">
                                <Skeleton className="h-40 w-full rounded-xl mb-4" />
                                <div className="space-y-2 mb-4">
                                    <Skeleton className="h-6 w-3/4" />
                                    <Skeleton className="h-4 w-1/2" />
                                </div>
                                <div className="flex justify-between items-center mt-auto">
                                    <Skeleton className="h-6 w-20" />
                                    <Skeleton className="h-9 w-24 rounded-lg" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : medicines.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {medicines.map((med) => (
                            <div key={med._id} className="bg-white dark:bg-surface rounded-2xl p-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 ease-out border border-gray-100 dark:border-white/5 flex flex-col h-full">
                                <div className="h-40 bg-white rounded-xl mb-4 overflow-hidden relative border border-gray-100 dark:border-white/5">
                                    <img
                                        src={med.image}
                                        alt={med.name}
                                        className="w-full h-full object-cover"
                                    />
                                    {med.prescriptionRequired && (
                                        <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm border border-amber-200 text-amber-700 text-xs px-2 py-1 rounded-md font-bold flex items-center shadow-sm">
                                            Rx Required
                                        </div>
                                    )}
                                </div>

                                <div className="flex-grow">
                                    <div className="flex justify-between items-start mb-1">
                                        <h3 className="font-bold text-gray-900 dark:text-text-primary text-lg line-clamp-1">{med.name}</h3>
                                        <span className="border border-gray-200 dark:border-teal-800 text-teal-700 dark:text-teal-300 text-xs px-2 py-0.5 rounded font-medium"
                                            style={{ backgroundColor: 'var(--bg-surface)' }}
                                        >
                                            {med.strength}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-500 dark:text-text-secondary mb-2">{med.composition}</p>
                                    <p className="text-xs text-gray-400 dark:text-text-muted mb-4 line-clamp-2">{med.description}</p>
                                </div>

                                <div className="mt-auto flex justify-between items-center pt-4 border-t border-gray-50 dark:border-white/5">
                                    <div>
                                        <span className="text-lg font-bold text-gray-900 dark:text-text-primary">₹{med.price}</span>
                                        <span className="text-xs text-gray-500 dark:text-text-muted ml-1">/{med.dosageForm === 'Tablet' ? 'Strip' : 'Unit'}</span>
                                    </div>
                                    <button
                                        onClick={() => addToCart(med)}
                                        className="bg-teal-600 hover:bg-teal-700 text-white p-2 rounded-lg transition shadow-sm flex items-center gap-1 text-sm font-medium pr-3"
                                    >
                                        <Plus className="h-4 w-4" />
                                        Add
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white dark:bg-surface rounded-lg shadow-sm">
                        <Filter className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-text-primary">No medicines found</h3>
                        <p className="mt-1 text-text-secondary">Try adjusting your search or category filter.</p>
                        <button
                            onClick={() => { setSearchTerm(''); setActiveCategory('All'); }}
                            className="mt-4 text-teal-600 font-medium hover:underline"
                        >
                            Clear Filters
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Medicines;
