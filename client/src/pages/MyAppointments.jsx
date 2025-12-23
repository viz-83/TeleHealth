import React from 'react';
import Navbar from '../components/Navbar';
import MyAppointmentsSection from '../components/MyAppointmentsSection';

const MyAppointments = () => {
    return (
        <div className="min-h-screen bg-background-light">
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 py-8">
                <MyAppointmentsSection />
            </div>
        </div>
    );
};

export default MyAppointments;
