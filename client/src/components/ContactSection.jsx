import React, { useState } from 'react';
import { FaMapMarkerAlt, FaPhone, FaEnvelope } from 'react-icons/fa';

const ContactSection = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        message: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSendMessage = (e) => {
        e.preventDefault();
        const { firstName, lastName, email, message } = formData;

        if (!firstName || !lastName || !email || !message) {
            alert("Please fill in all fields.");
            return;
        }

        alert("Message sent successfully!");
        setFormData({
            firstName: '',
            lastName: '',
            email: '',
            message: ''
        });
    };

    return (
        <div className="bg-white dark:bg-surface py-20 border-t border-gray-100 dark:border-gray-800">
            <div className="max-w-7xl mx-auto px-8">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-4">Get in Touch</h2>
                    <p className="text-xl text-gray-600 dark:text-gray-400">We'd love to hear from you. Here is how you can reach us.</p>
                </div>

                <div className="flex flex-col md:flex-row gap-12">
                    {/* Contact Info */}
                    <div className="md:w-1/3 space-y-8">
                        <div className="flex items-start">
                            <div className="bg-blue-100 dark:bg-blue-900/30 p-4 rounded-lg text-blue-600 text-2xl mr-6">
                                <FaMapMarkerAlt />
                            </div>
                            <div>
                                <h4 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">Our Location</h4>
                                <p className="text-gray-600 dark:text-gray-400">123 Health Avenue, Suite 100<br />Medical District, CA 90210</p>
                            </div>
                        </div>

                        <div className="flex items-start">
                            <div className="bg-blue-100 dark:bg-blue-900/30 p-4 rounded-lg text-blue-600 text-2xl mr-6">
                                <FaPhone />
                            </div>
                            <div>
                                <h4 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">Phone Number</h4>
                                <p className="text-gray-600 dark:text-gray-400">+1 (555) 123-4567<br />Mon-Fri 9am-6pm</p>
                            </div>
                        </div>

                        <div className="flex items-start">
                            <div className="bg-blue-100 dark:bg-blue-900/30 p-4 rounded-lg text-blue-600 text-2xl mr-6">
                                <FaEnvelope />
                            </div>
                            <div>
                                <h4 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">Email Address</h4>
                                <p className="text-gray-600 dark:text-gray-400">support@medsync.com<br />info@medsync.com</p>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="md:w-2/3 bg-gray-50 dark:bg-gray-800/50 p-8 rounded-2xl shadow-sm">
                        <form className="space-y-6" onSubmit={handleSendMessage}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">First Name</label>
                                    <input
                                        type="text"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
                                        placeholder="John"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">Last Name</label>
                                    <input
                                        type="text"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
                                        placeholder="Doe"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
                                    placeholder="john@example.com"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">Message</label>
                                <textarea
                                    rows="4"
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
                                    placeholder="How can we help you?"
                                    required
                                ></textarea>
                            </div>
                            <button type="submit" className="w-full md:w-auto px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold text-lg shadow-md">
                                Send Message
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactSection;
