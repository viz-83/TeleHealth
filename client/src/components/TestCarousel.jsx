import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';

const TestCarousel = () => {
    const [tests, setTests] = useState([]);
    const [loading, setLoading] = useState(true);
    const scrollContainerRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTests = async () => {
            try {
                const res = await axiosInstance.get('/api/v1/tests');
                // Filter to show only featured or all tests. Showing first 8 for carousel.
                if (res.data.data.tests) {
                    setTests(res.data.data.tests.slice(0, 8));
                }
            } catch (error) {
                console.error("Error fetching tests for carousel:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchTests();
    }, []);

    const scroll = (direction) => {
        if (scrollContainerRef.current) {
            const container = scrollContainerRef.current;
            const scrollAmount = 300; // Approx card width + gap for smaller cards
            const targetScroll = container.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount);

            container.scrollTo({
                left: targetScroll,
                behavior: 'smooth'
            });
        }
    };

    if (loading) return null;
    if (tests.length === 0) return null;

    return (
        <section className="py-20 bg-background-subtle">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                    <div>
                        <h2 className="text-4xl font-heading font-bold text-text-primary mb-4">
                            Checkup from Home
                        </h2>
                        <p className="text-lg text-text-secondary max-w-2xl">
                            Lab tests, health packages, and more — collected at your doorstep.
                        </p>
                    </div>

                    {/* Navigation Buttons */}
                    <div className="flex gap-3">
                        <button
                            onClick={() => scroll('left')}
                            className="p-3 rounded-full bg-white border border-gray-200 shadow-sm text-gray-700 hover:bg-gray-50 hover:text-teal-600 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                            aria-label="Scroll left"
                        >
                            <ChevronLeft className="h-6 w-6" />
                        </button>
                        <button
                            onClick={() => scroll('right')}
                            className="p-3 rounded-full bg-white border border-gray-200 shadow-sm text-gray-700 hover:bg-gray-50 hover:text-teal-600 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                            aria-label="Scroll right"
                        >
                            <ChevronRight className="h-6 w-6" />
                        </button>
                    </div>
                </div>

                {/* Carousel Container */}
                <div
                    ref={scrollContainerRef}
                    className="flex overflow-x-auto gap-6 pb-8 snap-x snap-mandatory scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {tests.map((test) => (
                        <div
                            key={test._id}
                            className="flex-shrink-0 w-72 bg-white rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 snap-start border border-transparent hover:border-teal-100 flex flex-col justify-between h-[400px] overflow-hidden"
                        >
                            {/* Image Section */}
                            <div className="h-40 w-full overflow-hidden relative">
                                <img
                                    src={test.image}
                                    alt={test.name}
                                    className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute top-4 left-4 inline-block px-3 py-1 bg-white/90 backdrop-blur-sm text-teal-700 text-xs font-bold uppercase tracking-wider rounded-full shadow-sm">
                                    {test.category}
                                </div>
                            </div>

                            <div className="p-6 flex flex-col justify-between flex-grow">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 leading-tight">
                                        {test.name}
                                    </h3>
                                    <p className="text-gray-500 mb-4 line-clamp-2 text-sm">
                                        {test.description}
                                    </p>
                                </div>

                                <div className="mt-auto">
                                    <div className="flex items-baseline mb-4">
                                        <span className="text-2xl font-bold text-teal-700">₹{test.price}</span>
                                        {test.oldPrice && (
                                            <span className="ml-2 text-sm text-gray-400 line-through">₹{test.oldPrice}</span>
                                        )}
                                    </div>
                                    <button
                                        onClick={() => navigate('/tests')}
                                        className="group w-full flex items-center justify-between text-sm font-bold text-gray-900 hover:text-teal-700 transition-colors"
                                    >
                                        <span>Book Now</span>
                                        <div className="p-1.5 rounded-full bg-gray-100 group-hover:bg-teal-50 transition-colors">
                                            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* "See All" End Card */}
                    <div
                        onClick={() => navigate('/tests')}
                        className="flex-shrink-0 w-64 bg-teal-600 rounded-3xl p-8 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 snap-start cursor-pointer flex flex-col justify-center items-center text-center h-[400px] group"
                    >
                        <h3 className="text-2xl font-bold text-white mb-2">Explore All Tests</h3>
                        <p className="text-teal-100 mb-8">View our complete catalog of diagnostic services.</p>
                        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                            <ArrowRight className="h-8 w-8 text-white" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default TestCarousel;
