import React from 'react';
import { FaPlay } from 'react-icons/fa';

const BentoGrid = () => {
    return (
        <section className="py-24 bg-background-light text-text-primary">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-heading font-bold tracking-tight mb-4 text-text-primary">
                        Complete Care, Simplified
                    </h2>
                    <p className="text-text-secondary text-lg max-w-2xl mx-auto">
                        From AI-powered diagnostics to 1-on-1 specialist consultations, we've built a healthcare ecosystem designed entirely around you.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 h-auto lg:h-[600px]">

                    {/* 1. Lab Results */}
                    <div className="bg-surface rounded-[2rem] p-8 text-text-primary flex flex-col justify-between group overflow-hidden relative min-h-[300px] border border-gray-100 dark:border-gray-800 hover:shadow-xl transition-shadow duration-300">
                        <div className="relative z-10 block">
                            <h3 className="text-2xl font-body font-bold mb-2">Precision Diagnostics</h3>
                            <p className="text-text-secondary">Clinical-grade lab results delivered to your device in 24 hours.</p>
                        </div>
                        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-secondary/30 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
                        <div className="mt-8 bg-background-light p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transform rotate-2 group-hover:rotate-0 transition-transform duration-500 hover:scale-105 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-1 h-full bg-cta"></div>
                            <div className="h-2 w-24 bg-gray-200 dark:bg-gray-700 rounded mb-3"></div>
                            <div className="flex items-center gap-2 mb-2">
                                <div className="h-2 w-2 bg-cta rounded-full animate-pulse"></div>
                                <div className="h-2 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                                    <div className="h-full w-3/4 bg-cta group-hover:w-full transition-all duration-1000 ease-out"></div>
                                </div>
                            </div>
                            <div className="flex justify-between text-xs text-text-muted">
                                <span>Analysis</span>
                                <span className="text-cta font-bold">Complete</span>
                            </div>
                        </div>
                    </div>

                    {/* 2. Vitals Monitoring */}
                    <div className="bg-secondary/20 rounded-[2rem] p-8 text-text-primary flex flex-col justify-between group overflow-hidden min-h-[300px] border border-secondary/20 hover:shadow-xl transition-shadow duration-300">
                        <div>
                            <h3 className="text-2xl font-body font-bold mb-2">Real-time Monitoring</h3>
                            <p className="text-text-secondary">Track vital trends like BP & Glucose with medical accuracy.</p>
                        </div>
                        <div className="mt-6 relative h-32 flex items-end gap-2 px-2">
                            <div className="w-full bg-white rounded-xl shadow-sm p-3 h-full flex items-end justify-between gap-1 border border-white/40">
                                <div className="w-1/6 bg-cta/20 h-1/3 rounded-t-lg group-hover:h-1/2 transition-all duration-500"></div>
                                <div className="w-1/6 bg-cta/30 h-1/2 rounded-t-lg group-hover:h-2/3 transition-all duration-500 delay-75"></div>
                                <div className="w-1/6 bg-cta/40 h-1/4 rounded-t-lg group-hover:h-1/3 transition-all duration-500 delay-100"></div>
                                <div className="w-1/6 bg-cta h-3/4 rounded-t-lg group-hover:h-full transition-all duration-500 delay-150 relative shadow-lg shadow-cta/20">
                                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-surface text-cta text-[10px] font-bold px-2 py-1 rounded shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">120/80</div>
                                </div>
                                <div className="w-1/6 bg-cta/40 h-2/3 rounded-t-lg group-hover:h-1/2 transition-all duration-500 delay-200"></div>
                            </div>
                        </div>
                    </div>

                    {/* 3. AI Assistant */}
                    <div className="bg-surface rounded-[2rem] p-8 text-text-primary flex flex-col justify-between group overflow-hidden min-h-[300px] border border-gray-100 dark:border-gray-800 hover:shadow-xl transition-shadow duration-300">
                        <div className="z-10 relative">
                            <h3 className="text-2xl font-body font-bold mb-2">AI Health Assistant</h3>
                            <p className="text-text-secondary">Instant symptom assessment powered by advanced AI.</p>
                        </div>
                        <div className="mt-4 relative h-40">
                            <div className="absolute top-0 right-0 bg-secondary/30 text-cta text-xs font-bold px-4 py-2 rounded-full transform translate-x-2 -translate-y-2 animate-float border border-secondary/20">Headache</div>
                            <div className="absolute top-12 left-0 bg-red-50 text-red-500 text-xs font-bold px-4 py-2 rounded-full transform -translate-x-2 animate-float-delayed border border-red-100">Fever</div>
                            <div className="absolute bottom-6 right-8 bg-blue-50 text-blue-500 text-xs font-bold px-5 py-2.5 rounded-full scale-110 shadow-lg animate-pulse-slow border border-blue-100">Flu Symptoms?</div>
                            <div className="absolute bottom-10 left-4 w-12 h-12 rounded-full border border-gray-100 flex items-center justify-center bg-gray-50 group-hover:scale-110 transition-transform">
                                <div className="w-2 h-2 bg-cta rounded-full animate-ping"></div>
                            </div>
                        </div>
                    </div>

                    {/* 4. Doctor Reports (Wide) */}
                    <div className="lg:col-span-2 bg-surface dark:bg-gray-800/50 rounded-[2rem] p-8 text-text-primary flex flex-col md:flex-row items-center gap-8 group overflow-hidden min-h-[300px] border border-secondary/20 hover:shadow-xl transition-shadow duration-300">
                        <div className="md:w-1/2 relative z-10">
                            <h3 className="text-2xl font-body font-bold mb-4">Comprehensive Care Plans</h3>
                            <p className="text-text-secondary leading-relaxed mb-6">
                                Receive a detailed health breakdown reviewed by board-certified specialists, complete with actionable prescriptions and lifestyle guides.
                            </p>
                            <div className="flex gap-2">
                                <span className="bg-surface/80 backdrop-blur-sm px-3 py-1.5 rounded-lg text-xs font-bold text-cta border border-cta/10 shadow-sm">Board Certified</span>
                                <span className="bg-surface/80 backdrop-blur-sm px-3 py-1.5 rounded-lg text-xs font-bold text-cta border border-cta/10 shadow-sm">Secure & Private</span>
                            </div>
                        </div>
                        <div className="md:w-1/2 w-full relative">
                            <div className="bg-white p-6 rounded-t-2xl shadow-2xl border border-gray-100 w-3/4 mx-auto transform translate-y-6 group-hover:translate-y-2 transition-transform duration-500">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-10 h-10 bg-secondary/30 rounded-full flex items-center justify-center text-cta">
                                        <div className="w-5 h-5 border-2 border-current rounded-full"></div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <div className="h-2.5 w-24 bg-gray-200 rounded-full"></div>
                                        <div className="h-2 w-16 bg-gray-100 rounded-full"></div>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <div className="h-2 w-full bg-gray-100 rounded-full group-hover:animate-shimmer"></div>
                                    <div className="h-2 w-full bg-gray-100 rounded-full group-hover:animate-shimmer" style={{ animationDelay: '0.2s' }}></div>
                                    <div className="h-2 w-2/3 bg-gray-100 rounded-full group-hover:animate-shimmer" style={{ animationDelay: '0.4s' }}></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 5. Expert Support */}
                    <div className="bg-surface rounded-[2rem] p-8 text-text-primary flex flex-col justify-between group overflow-hidden min-h-[300px] relative border border-gray-100 dark:border-gray-800 hover:shadow-xl transition-shadow duration-300">
                        <div className="relative z-10">
                            <h3 className="text-2xl font-body font-bold mb-2">Instant Specialist Access</h3>
                            <p className="text-text-secondary">Free 1:1 video consultations included with every plan.</p>
                        </div>
                        <div className="mt-6 relative rounded-2xl overflow-hidden bg-gray-100 h-48 w-full shadow-lg group-hover:shadow-2xl transition-all duration-500 border border-gray-100">
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-16 h-16 bg-white/50 backdrop-blur-md rounded-full flex items-center justify-center border border-white/40 group-hover:scale-110 transition-transform duration-300">
                                    <div className="w-0 h-0 border-l-[10px] border-l-cta border-y-[6px] border-y-transparent ml-1"></div>
                                </div>
                            </div>
                            <div className="absolute bottom-4 left-0 right-0 px-4 flex justify-between items-center">
                                <div className="flex -space-x-2">
                                    <div className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white"></div>
                                    <div className="w-8 h-8 rounded-full bg-gray-300 border-2 border-white"></div>
                                </div>
                                <div className="flex gap-2">
                                    <div className="w-8 h-8 bg-red-500/90 hover:bg-red-500 backdrop-blur-sm rounded-full flex items-center justify-center text-white text-[10px] animate-pulse shadow-lg cursor-pointer transition-colors">✕</div>
                                    <div className="w-8 h-8 bg-black/5 hover:bg-black/10 backdrop-blur-sm rounded-full cursor-pointer transition-colors"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-16 text-center">
                    <button className="bg-cta hover:bg-cta-hover text-white font-bold py-4 px-10 rounded-full transition-all shadow-xl shadow-cta/20 hover:shadow-2xl hover:shadow-cta/30 transform hover:-translate-y-1">
                        Start your health journey
                    </button>
                </div>
            </div>
        </section>
    );
};

export default BentoGrid;
