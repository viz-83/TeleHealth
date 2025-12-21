import { useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { useMedicineCart } from '../context/MedicineCartContext';
import { Search, Filter, ShoppingCart, Plus, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Medicines = () => {
    const [medicines, setMedicines] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');

    const { addToCart } = useMedicineCart();
    const navigate = useNavigate();

    const categories = ["All", "Tablets", "Syrups", "OTC", "Chronic Care", "Vitamins & Supplements", "First Aid"];

    useEffect(() => {
        fetchMedicines();
    }, [searchTerm, activeCategory]);

    const fetchMedicines = async () => {
        try {
            setLoading(true);
            let query = '/api/v1/medicines?isActive=true';

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
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Header */}
            <div className="bg-teal-700 text-white pt-8 pb-16 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-3xl font-bold">Online Pharmacy</h1>
                        <button
                            onClick={() => navigate('/medicines/cart')}
                            className="bg-white/20 p-2 rounded-full hover:bg-white/30 transition backdrop-blur-sm relative"
                        >
                            <ShoppingCart className="h-6 w-6 text-white" />
                        </button>
                    </div>

                    {/* Search Bar */}
                    <div className="relative max-w-2xl">
                        <input
                            type="text"
                            placeholder="Search for medicines, brands, or composition..."
                            className="w-full pl-12 pr-4 py-3 rounded-xl text-gray-900 border-none focus:ring-2 focus:ring-teal-300 shadow-lg"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 -mt-8">
                {/* Categories */}
                <div className="bg-white p-4 rounded-xl shadow-sm mb-6 overflow-x-auto flex space-x-2 no-scrollbar">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-4 py-2 rounded-lg whitespace-nowrap text-sm font-medium transition-colors ${activeCategory === cat
                                ? 'bg-teal-600 text-white'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Medicine Grid */}
                {loading ? (
                    <div className="text-center py-20 text-gray-500">Loading medicines...</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {medicines.map((med) => (
                            <div key={med._id} className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition border border-gray-100 flex flex-col h-full">
                                <div className="h-40 bg-gray-100 rounded-xl mb-4 overflow-hidden relative">
                                    <img
                                        src={med.image}
                                        alt={med.name}
                                        className="w-full h-full object-cover"
                                    />
                                    {med.prescriptionRequired && (
                                        <div className="absolute top-2 right-2 bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-md font-bold flex items-center shadow-sm">
                                            Rx Required
                                        </div>
                                    )}
                                </div>

                                <div className="flex-grow">
                                    <div className="flex justify-between items-start mb-1">
                                        <h3 className="font-bold text-gray-900 text-lg line-clamp-1">{med.name}</h3>
                                        <span className="bg-teal-50 text-teal-700 text-xs px-2 py-0.5 rounded font-medium">
                                            {med.strength}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-500 mb-2">{med.composition}</p>
                                    <p className="text-xs text-gray-400 mb-4 line-clamp-2">{med.description}</p>
                                </div>

                                <div className="mt-auto flex justify-between items-center pt-4 border-t border-gray-50">
                                    <div>
                                        <span className="text-lg font-bold text-gray-900">₹{med.price}</span>
                                        <span className="text-xs text-gray-500 ml-1">/{med.dosageForm === 'Tablet' ? 'Strip' : 'Unit'}</span>
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
                )}

                {!loading && medicines.length === 0 && (
                    <div className="text-center py-20">
                        <p className="text-gray-500 text-lg">No medicines found searching for "{searchTerm}"</p>
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
