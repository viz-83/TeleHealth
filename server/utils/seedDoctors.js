const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Doctor = require('../models/doctorModel');

dotenv.config({ path: './.env' }); // Adjusted to look in the current directory (server/)

const doctors = [
    {
        name: 'Dr. John Doe',
        specialization: 'Cardiologist',
        hospitalName: 'City Heart Hospital',
        location: {
            city: 'New York',
            state: 'NY',
            pincode: '10001',
            fullAddress: '123 Heart Ave, New York, NY',
            coordinates: {
                type: 'Point',
                coordinates: [-74.0060, 40.7128]
            }
        },
        availabilitySlots: [
            { dayOfWeek: 1, startTime: '09:00', endTime: '17:00' }, // Monday
            { dayOfWeek: 2, startTime: '09:00', endTime: '17:00' }, // Tuesday
            { dayOfWeek: 3, startTime: '09:00', endTime: '17:00' }, // Wednesday
            { dayOfWeek: 4, startTime: '09:00', endTime: '17:00' }, // Thursday
            { dayOfWeek: 5, startTime: '09:00', endTime: '17:00' }  // Friday
        ]
    },
    {
        name: 'Dr. Jane Smith',
        specialization: 'Dermatologist',
        hospitalName: 'Skin Care Clinic',
        location: {
            city: 'Los Angeles',
            state: 'CA',
            pincode: '90001',
            fullAddress: '456 Skin Blvd, Los Angeles, CA',
            coordinates: {
                type: 'Point',
                coordinates: [-118.2437, 34.0522]
            }
        },
        availabilitySlots: [
            { dayOfWeek: 1, startTime: '10:00', endTime: '16:00' },
            { dayOfWeek: 3, startTime: '10:00', endTime: '16:00' },
            { dayOfWeek: 5, startTime: '10:00', endTime: '16:00' }
        ]
    },
    {
        name: 'Dr. Emily White',
        specialization: 'Pediatrician',
        hospitalName: 'Kids Health Center',
        location: {
            city: 'Chicago',
            state: 'IL',
            pincode: '60601',
            fullAddress: '789 Kids Way, Chicago, IL',
            coordinates: {
                type: 'Point',
                coordinates: [-87.6298, 41.8781]
            }
        },
        availabilitySlots: [
            { dayOfWeek: 2, startTime: '08:00', endTime: '14:00' },
            { dayOfWeek: 4, startTime: '08:00', endTime: '14:00' },
            { dayOfWeek: 6, startTime: '09:00', endTime: '13:00' }
        ]
    },
    {
        name: 'Dr. Michael Brown',
        specialization: 'Neurologist',
        hospitalName: 'Brain & Spine Institute',
        location: {
            city: 'Houston',
            state: 'TX',
            pincode: '77001',
            fullAddress: '101 Brain St, Houston, TX',
            coordinates: {
                type: 'Point',
                coordinates: [-95.3698, 29.7604]
            }
        },
        availabilitySlots: [
            { dayOfWeek: 1, startTime: '11:00', endTime: '19:00' },
            { dayOfWeek: 3, startTime: '11:00', endTime: '19:00' },
            { dayOfWeek: 5, startTime: '11:00', endTime: '19:00' }
        ]
    },
    {
        name: 'Dr. Sarah Green',
        specialization: 'General Physician',
        hospitalName: 'Community Health Clinic',
        location: {
            city: 'Phoenix',
            state: 'AZ',
            pincode: '85001',
            fullAddress: '202 Health Rd, Phoenix, AZ',
            coordinates: {
                type: 'Point',
                coordinates: [-112.0740, 33.4484]
            }
        },
        availabilitySlots: [
            { dayOfWeek: 0, startTime: '10:00', endTime: '14:00' }, // Sunday
            { dayOfWeek: 1, startTime: '09:00', endTime: '18:00' },
            { dayOfWeek: 2, startTime: '09:00', endTime: '18:00' },
            { dayOfWeek: 3, startTime: '09:00', endTime: '18:00' },
            { dayOfWeek: 4, startTime: '09:00', endTime: '18:00' },
            { dayOfWeek: 5, startTime: '09:00', endTime: '18:00' },
            { dayOfWeek: 6, startTime: '10:00', endTime: '14:00' }
        ]
    }
];

const seedDoctors = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        await Doctor.deleteMany();
        console.log('Cleared existing doctors');

        await Doctor.insertMany(doctors);
        console.log('Doctors seeded successfully');

        process.exit();
    } catch (error) {
        console.error('Error seeding doctors:', error);
        process.exit(1);
    }
};

seedDoctors();
