import React from 'react';
import { Link } from 'react-router-dom';
import { FaInstagram, FaFacebook, FaLinkedin, FaTwitter, FaYoutube } from 'react-icons/fa';

const Footer = () => {
    const FooterHeading = ({ children }) => (
        <h4 className="text-md font-heading font-bold text-text-primary mb-4">{children}</h4>
    );

    const FooterLink = ({ to, children }) => (
        <li className="mb-2">
            <Link to={to} className="text-sm text-text-secondary hover:text-cta transition-colors">
                {children}
            </Link>
        </li>
    );

    const SocialIcon = ({ icon: Icon, href }) => (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center text-cta hover:bg-cta hover:text-white transition-all duration-300"
        >
            <Icon size={18} />
        </a>
    );

    return (
        <footer className="bg-surface border-t border-gray-100 dark:border-gray-800 pt-16 pb-8 font-body">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    {/* Column 1: Care Pathways */}
                    <div>
                        <FooterHeading>Care Pathways</FooterHeading>
                        <ul className="list-none">
                            <FooterLink to="/symptom-checker">Symptom Checker</FooterLink>
                            <FooterLink to="/find-doctors">Find a Specialist</FooterLink>
                            <FooterLink to="/login">My Health Dashboard</FooterLink>
                            <FooterLink to="/patient/health-tracker">Vitals Tracker</FooterLink>
                            <FooterLink to="/ambulance/book">Emergency Booking</FooterLink>
                        </ul>
                    </div>

                    {/* Column 2: Who we are */}
                    <div>
                        <FooterHeading>Who we are</FooterHeading>
                        <ul className="list-none">
                            <FooterLink to="#">Our Story</FooterLink>
                            <FooterLink to="#">Medical Board</FooterLink>
                            <FooterLink to="#">Careers</FooterLink>
                            <FooterLink to="#">Press</FooterLink>
                            <FooterLink to="#">Diversity & Inclusion</FooterLink>
                        </ul>
                    </div>

                    {/* Column 3: Support */}
                    <div>
                        <FooterHeading>Support</FooterHeading>
                        <ul className="list-none">
                            <FooterLink to="#">FAQs</FooterLink>
                            <FooterLink to="#">Contact Us</FooterLink>
                            <FooterLink to="#">Privacy Policy</FooterLink>
                            <FooterLink to="#">Terms of Service</FooterLink>
                            <FooterLink to="#">Cookie Policy</FooterLink>
                        </ul>
                    </div>

                    {/* Column 4: Brand & Socials */}
                    <div>
                        <Link to="/" className="flex items-center space-x-2 mb-6">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cta to-primary flex items-center justify-center text-white font-bold font-heading">
                                M
                            </div>
                            <span className="text-xl font-heading font-bold text-primary">
                                MedSync
                            </span>
                        </Link>
                        <p className="text-text-secondary text-sm mb-6 leading-relaxed">
                            Reimagining healthcare with a patient-first approach. Secure, accessible, and compassionate care for everyone.
                        </p>
                        <div className="flex space-x-3">
                            <SocialIcon icon={FaInstagram} href="#" />
                            <SocialIcon icon={FaFacebook} href="#" />
                            <SocialIcon icon={FaLinkedin} href="#" />
                            <SocialIcon icon={FaTwitter} href="#" />
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-xs text-text-muted">
                        © {new Date().getFullYear()} MedSync Healthcare. All rights reserved.
                    </p>
                    <div className="flex gap-4">
                        <span className="text-xs text-text-muted px-2 py-1 bg-transparent border border-gray-200 dark:border-gray-700 rounded">ISO 27001 Certified</span>
                        <span className="text-xs text-text-muted px-2 py-1 bg-transparent border border-gray-200 dark:border-gray-700 rounded">GDPR Compliant</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
