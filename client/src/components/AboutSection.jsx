import React from 'react';
import aboutImage from '../assets/find_doctors_card.png';

const AboutSection = () => {
    return (
        <div className="bg-white py-20">
            <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row items-center">
                <div className="md:w-1/2 mb-10 md:mb-0 md:pr-16">
                    <img
                        src={aboutImage}
                        alt="About MedSync"
                        className="rounded-2xl shadow-xl w-full object-cover transform hover:scale-105 transition duration-500"
                    />
                </div>
                <div className="md:w-1/2">
                    <h2 className="text-4xl font-bold text-gray-800 mb-6">About MedSync</h2>
                    <h3 className="text-xl text-blue-600 font-semibold mb-6">Revolutionizing Healthcare Access</h3>
                    <p className="text-lg text-gray-600 leading-relaxed mb-6">
                        At MedSync, we believe that quality healthcare should be accessible to everyone, regardless of location or schedule. We are dedicated to bridging the gap between patients and healthcare providers through innovative technology.
                    </p>
                    <p className="text-lg text-gray-600 leading-relaxed">
                        Our platform connects you with a diverse network of top-tier specialists, ensuring that expert medical advice is just a click away. Whether you need a quick consultation or ongoing care management, MedSync is your trusted partner in health.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AboutSection;
