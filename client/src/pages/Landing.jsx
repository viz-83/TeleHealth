import React from 'react';
import { Link } from 'react-router-dom';
import LandingNavbar from '../components/LandingNavbar';
import doctorsHero from '../assets/doctors_hero.png';

const Landing = () => {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <LandingNavbar />
            <div className="flex-1 flex flex-col md:flex-row items-center justify-center pt-20 px-8 max-w-7xl mx-auto">
                <div className="md:w-1/2 text-center md:text-left mb-12 md:mb-0">
                    <h1 className="text-5xl font-bold text-blue-600 mb-6 leading-tight">
                        Your Health, Our Priority. <br />
                        <span className="text-gray-800">Anytime, Anywhere.</span>
                    </h1>
                    <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                        Experience the future of healthcare with TeleHealth. Connect with top-rated doctors and specialists instantly through secure video calls and chat. Skip the waiting room and get the care you deserve, from the comfort of your home.
                    </p>
                    <div className="space-x-4">
                        <Link to="/login" className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold text-lg shadow-lg">Get Started</Link>
                        <Link to="/signup" className="px-8 py-4 bg-white text-blue-600 border-2 border-blue-600 rounded-lg hover:bg-blue-50 transition font-semibold text-lg">Join Now</Link>
                    </div>
                </div>
                <div className="md:w-1/2 flex justify-center">
                    <img
                        src={doctorsHero}
                        alt="Team of Doctors"
                        className="rounded-2xl max-w-full h-auto object-cover"
                    />
                </div>
            </div>
        </div>
    );
};

export default Landing;
