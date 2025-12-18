import React from 'react';
import { FaVideo, FaUserMd, FaHeartbeat } from 'react-icons/fa';

const ServiceSection = () => {
    const services = [
        {
            icon: <FaVideo className="text-5xl text-blue-600 mb-4" />,
            title: "Online Consultation",
            description: "Connect with doctors instantly via secure video calls."
        },
        {
            icon: <FaUserMd className="text-5xl text-blue-600 mb-4" />,
            title: "Specialist Referral",
            description: "Get referred to top specialists for advanced care."
        },
        {
            icon: <FaHeartbeat className="text-5xl text-blue-600 mb-4" />,
            title: "Health Tracking",
            description: "Monitor your health vitals and history in one place."
        }
    ];

    return (
        <div className="bg-gray-50 py-20">
            <div className="max-w-7xl mx-auto px-8">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold text-gray-800 mb-4">Our Services</h2>
                    <p className="text-xl text-gray-600">Comprehensive healthcare solutions tailored to your needs</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    {services.map((service, index) => (
                        <div key={index} className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition duration-300 flex flex-col items-center text-center">
                            <div className="mb-6 p-4 bg-blue-50 rounded-full">
                                {service.icon}
                            </div>
                            <h3 className="text-2xl font-bold text-gray-800 mb-4">{service.title}</h3>
                            <p className="text-gray-600 leading-relaxed">
                                {service.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ServiceSection;
