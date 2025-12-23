import React from 'react';
import Navbar from '../components/Navbar';
import FindDoctorsSection from '../components/FindDoctorsSection';

const FindDoctors = () => {
    return (
        <div className="min-h-screen bg-background-light">
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 py-8">
                <FindDoctorsSection />
            </div>
        </div>
    );
};

export default FindDoctors;
