import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import doctorsHero from '../assets/doctors_hero.png';
import findDoctorsCard from '../assets/find_doctors_card.png';
import myAppointmentsCard from '../assets/my_appointments_card.png';

const Dashboard = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));

    const services = [
        {
            title: "Find Doctors",
            description: "Search for specialists and book appointments with top-rated doctors near you.",
            image: findDoctorsCard,
            action: () => navigate('/find-doctors')
        },
        {
            title: "My Appointments",
            description: "View your upcoming schedule, join video calls, and manage your bookings.",
            image: myAppointmentsCard,
            action: () => navigate('/my-appointments')
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />

            {/* Hero Section */}
            <div className="flex-1 flex flex-col md:flex-row items-center justify-center py-20 px-8 max-w-7xl mx-auto">
                <div className="md:w-1/2 text-center md:text-left mb-12 md:mb-0">
                    <h1 className="text-5xl font-bold text-blue-600 mb-6 leading-tight">
                        Welcome back, {user?.name?.split(' ')[0]}! <br />
                        <span className="text-gray-800">Your Health Dashboard.</span>
                    </h1>
                    <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                        Manage your appointments, find specialists, and connect with doctors instantly. All your healthcare needs in one place.
                    </p>
                    <div className="space-x-4">
                        <button onClick={() => document.getElementById('services').scrollIntoView({ behavior: 'smooth' })} className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold text-lg shadow-lg">Get Started</button>
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

            {/* Services Section */}
            <div id="services" className="bg-gray-100 py-20">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-gray-800 mb-4">We Offer a Wide Range of Unique Services</h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Journey to better health and wellbeing. Treatment for specific conditions, simple looking to improve, and reflects the tone you want to convey to you.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {services.map((service, index) => (
                            <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col h-full cursor-pointer" onClick={service.action}>
                                <div className="p-8 flex-1">
                                    <h3 className="text-2xl font-bold text-gray-800 mb-4">{service.title}</h3>
                                    <p className="text-gray-600 leading-relaxed mb-6">
                                        {service.description}
                                    </p>
                                    <div className="rounded-lg overflow-hidden h-48 w-full">
                                        <img
                                            src={service.image}
                                            alt={service.title}
                                            className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
