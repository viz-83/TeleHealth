import React from 'react';
import { Link } from 'react-router-dom';
import LandingNavbar from '../components/LandingNavbar';
import doctorsHero from '../assets/doctors_hero.png';
import aboutImage from '../assets/find_doctors_card.png';
import ServiceSection from '../components/ServiceSection';
import ContactSection from '../components/ContactSection';
import AboutSection from '../components/AboutSection';

const Landing = () => {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <LandingNavbar />
            <div className="flex-1 flex flex-col md:flex-row items-center justify-center pt-20 px-8 max-w-7xl mx-auto mb-20">
                <div className="md:w-1/2 text-center md:text-left mb-12 md:mb-0">
                    <h1 className="text-5xl font-bold text-blue-600 mb-6 leading-tight">
                        Your Health, Our Priority. <br />
                        <span className="text-gray-800">Anytime, Anywhere.</span>
                    </h1>
                    <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                        Experience the future of healthcare with MedSync. Connect with top-rated doctors and specialists instantly through secure video calls and chat. Skip the waiting room and get the care you deserve, from the comfort of your home.
                    </p>
                    <div className="space-x-4">
                        <Link to="/login" className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold text-lg shadow-lg">Get Started</Link>
                        <Link to="/symptom-checker" className="px-8 py-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-semibold text-lg shadow-lg">Check Symptoms</Link>
                    </div>
                </div>
                <div className="md:w-1/2 flex justify-center">
                    <img
                        src={doctorsHero}
                        alt="Team of Doctors"
                        className="rounded-2xl max-w-full h-auto object-cover shadow-2xl"
                    />
                </div>
            </div>

            {/* About Section */}
            {/* About Section */}
            <AboutSection />

            {/* Service Section */}
            <ServiceSection />

            {/* Contact Section */}
            <ContactSection />

        </div>
    );
};

export default Landing;
