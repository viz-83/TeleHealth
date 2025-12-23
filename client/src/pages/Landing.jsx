import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Button from '../components/ui/Button';
import ServiceCard from '../components/ui/ServiceCard';
import BentoGrid from '../components/BentoGrid';
import doctorsHero from '../assets/doctors_hero.jpeg';
import { FaLaptopMedical, FaUserMd, FaNotesMedical, FaHeartbeat, FaCalendarAlt, FaMicroscope } from 'react-icons/fa';
import { Pill } from 'lucide-react';
import DiseaseMarquee from '../components/DiseaseMarquee';
import TestCarousel from '../components/TestCarousel';
import GetCareToday from '../components/GetCareToday';

const Landing = () => {
    const navigate = useNavigate();
    const firstName = 'There'; // Generic greeting for guests

    // Redirect logic
    const handleNavigation = (path) => {
        const token = localStorage.getItem('token');
        if (token) {
            navigate(path);
        } else {
            navigate('/login');
        }
    };

    const services = [
        {
            title: "Find a Doctor",
            description: "Browse specialists, read reviews, and book video consultations instantly.",
            icon: FaUserMd,
            action: () => handleNavigation('/find-doctors')
        },
        {
            title: "My Appointments",
            description: "Join upcoming video calls and view your consultation history.",
            icon: FaCalendarAlt,
            action: () => handleNavigation('/my-appointments')
        },
        {
            title: "Symptom Checker",
            description: "AI-powered assessment to guide you to the right care urgency.",
            icon: FaNotesMedical,
            action: () => handleNavigation('/symptom-checker')
        },
        {
            title: "Health Tracker",
            description: "Log vitals like BP & Glucose to keep track of your wellbeing.",
            icon: FaHeartbeat,
            action: () => handleNavigation('/patient/health-tracker')
        },
        {
            title: "Online Pharmacy",
            description: "Order medicines & health products",
            icon: Pill,
            action: () => handleNavigation('/medicines'),
            color: "bg-teal-50"
        },
        {
            title: "Home Lab Tests",
            description: "Book diagnostic tests for home sample collection.",
            icon: FaMicroscope,
            action: () => handleNavigation('/tests')
        },
    ];

    return (
        <div className="min-h-screen bg-background-light flex flex-col font-body">
            <Navbar />

            {/* 1. HERO SECTION - Editorial Style (Personalized) */}
            <section className="pt-32 pb-16 lg:pt-40 lg:pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-24">
                <div className="lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left z-10">
                    <span className="inline-block px-4 py-1.5 bg-secondary/30 text-cta font-bold text-xs tracking-wider uppercase rounded-full mb-6">
                        Welcome to MedSync
                    </span>
                    <h1 className="text-5xl lg:text-7xl font-heading font-bold text-text-primary mb-6 leading-tight">
                        Good Morning, <br />
                        <span className="text-cta italic">{firstName}.</span>
                    </h1>
                    <p className="text-lg text-text-secondary mb-10 leading-relaxed max-w-lg">
                        Ready to manage your health? connect with your specialists, track your progress, and stay on top of your wellbeing today.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                        <Button
                            size="lg"
                            className="shadow-xl shadow-cta/20 w-full sm:w-auto hover:scale-105 transition-transform"
                            onClick={() => handleNavigation('/find-doctors')}
                        >
                            Find a Doctor
                        </Button>
                        <Button
                            variant="outline"
                            size="lg"
                            className="w-full sm:w-auto hover:bg-white"
                            onClick={() => handleNavigation('/my-appointments')}
                        >
                            Upcoming Visits
                        </Button>
                    </div>
                </div>

                <div className="lg:w-1/2 relative w-full max-w-lg lg:max-w-none">
                    <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-secondary/20 rounded-[3rem] transform rotate-3 scale-105 -z-10 blur-sm"></div>
                    <img
                        src={doctorsHero}
                        alt="MedSync Doctor"
                        className="w-full h-[500px] object-cover rounded-[2.5rem] shadow-2xl transform -rotate-2 hover:rotate-0 transition-transform duration-700 ease-out border-4 border-white dark:border-gray-800"
                    />

                    {/* Floating Badge */}
                    <div className="absolute -bottom-8 -left-8 bg-surface p-6 rounded-2xl shadow-xl flex items-center gap-4 animate-bounce-slow hidden sm:flex">
                        <div className="w-12 h-12 border border-green-100 dark:border-green-900/30 rounded-full flex items-center justify-center text-green-600 dark:text-green-400"
                            style={{ backgroundColor: 'var(--bg-surface)' }}
                        >
                            <FaHeartbeat size={24} />
                        </div>
                        <div>
                            <p className="font-bold text-text-primary">Health Status</p>
                            <p className="text-xs text-text-secondary">All Systems Good</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 2. TRUST MARQUEE */}
            <section className="py-10 border-y border-gray-200/60 dark:border-gray-800/60 bg-white/50 dark:bg-white/5">
                <div className="max-w-7xl mx-auto px-4 overflow-hidden">
                    <p className="text-center text-sm font-bold text-text-muted mb-6 uppercase tracking-widest">Connect with top healthcare providers via</p>
                    <div className="flex justify-center flex-wrap gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                        <span className="text-xl font-heading font-bold">HealthPlus</span>
                        <span className="text-xl font-heading font-bold">MediCare</span>
                        <span className="text-xl font-heading font-bold">GlobalClinic</span>
                        <span className="text-xl font-heading font-bold">DocNet</span>
                        <span className="text-xl font-heading font-bold">CareAlliance</span>
                    </div>
                </div>
            </section>

            {/* 3. THINGS WE OFFER (Services Grid) */}
            <section className="py-24 bg-surface relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-secondary/10 via-transparent to-transparent pointer-events-none"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                    <div className="text-center mb-16 max-w-3xl mx-auto">
                        <h2 className="text-3xl md:text-5xl font-heading font-bold text-text-primary mb-6">
                            Your Care Dashboard
                        </h2>
                        <p className="text-lg text-text-secondary leading-relaxed">
                            Access all your medical tools in one place. Fast, secure, and always available.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {services.map((service, index) => (
                            <ServiceCard key={index} title={service.title} description={service.description} icon={service.icon} onClick={service.action} />
                        ))}
                    </div>
                </div>
            </section>



            {/* BENTO GRID */}
            <BentoGrid />

            {/* GET CARE TODAY */}
            <GetCareToday />

            {/* TEST CAROUSEL */}
            <TestCarousel />

            {/* DISEASE MARQUEE */}
            <DiseaseMarquee />

            {/* 4. MISSION / ABOUT - Split Section */}
            <section className="py-24 bg-background-subtle">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col lg:flex-row items-center gap-16">
                        <div className="lg:w-1/2">
                            <div className="relative">
                                <div className="absolute -inset-4 border-2 border-cta/20 rounded-3xl transform rotate-6"></div>
                                <div className="bg-cta p-12 rounded-3xl text-white relative overflow-hidden shadow-2xl">
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
                                    <h3 className="text-3xl font-heading font-bold mb-6">Patient Promise</h3>
                                    <p className="text-lg leading-relaxed opacity-90 mb-8">
                                        We are committed to providing you with the best digital healthcare experience. Your data is encrypted, your doctors are vetted, and your health is our priority.
                                    </p>
                                    <div className="flex gap-8">
                                        <div>
                                            <p className="text-4xl font-bold mb-1">Encrypted</p>
                                            <p className="text-sm opacity-75">Data Security</p>
                                        </div>
                                        <div>
                                            <p className="text-4xl font-bold mb-1">24/7</p>
                                            <p className="text-sm opacity-75">Support</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="lg:w-1/2">
                            <h2 className="text-4xl font-heading font-bold text-text-primary mb-6">
                                Need help?
                            </h2>
                            <div className="space-y-8">
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 bg-surface rounded-xl shadow-sm flex items-center justify-center text-cta shrink-0">
                                        <FaHeartbeat size={20} />
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-bold text-text-primary mb-2">Emergency?</h4>
                                        <p className="text-text-secondary">If you have a medical emergency, please call emergency services or book an ambulance immediately.</p>
                                    </div>
                                </div>
                                <Button variant="outline" onClick={() => handleNavigation('/ambulance/book')} className="mt-4">
                                    Book Ambulance
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 5. FOOTER */}
            <Footer />
        </div>
    );
};

export default Landing;
