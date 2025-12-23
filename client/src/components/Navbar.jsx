import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Button from './ui/Button';
import medsyncLogo from '../assets/medsync_logo.png';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';


const Navbar = () => {
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const location = useLocation();
    const [scrolled, setScrolled] = useState(false);
    const [hoveredElement, setHoveredElement] = useState(null);

    // Handle scroll effect for navbar
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 10) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const user = JSON.parse(localStorage.getItem('user') || '{}');

    // Helper to check active state
    const isActive = (path) => location.pathname === path;

    const NavItem = ({ to, children }) => (
        <Link
            to={to}
            className={`
                text-sm font-medium transition-colors duration-200
                ${isActive(to)
                    ? 'text-cta font-semibold border-b-2 border-cta pb-0.5'
                    : 'text-text-secondary hover:text-cta'}
            `}
        >
            {children}
        </Link>
    );

    return (
        <>
            <nav className={`
                fixed top-0 w-full z-50 transition-all duration-300
                ${scrolled ? 'bg-surface/95 backdrop-blur-sm shadow-sm border-b border-gray-100 dark:border-gray-800' : 'bg-transparent'}
            `}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16 sm:h-20">
                        <div className="flex items-center space-x-8">
                            <Link to="/" className="flex items-center space-x-0.5">
                                <img src={medsyncLogo} alt="MedSync Logo" className="w-14 h-14 object-contain" />
                                <span className="text-xl font-heading font-bold text-cta">
                                    MedSync
                                </span>
                            </Link>

                            <div className="hidden md:flex space-x-8">
                                <NavItem to="/">Home</NavItem>

                                {user && user.role === 'patient' && (
                                    <>
                                        <NavItem to="/symptom-checker">Symptom Checker</NavItem>
                                        <NavItem to="/find-doctors">Find Doctors</NavItem>
                                        <NavItem to="/my-appointments">Appointments</NavItem>
                                        <NavItem to="/patient/health-tracker">Health Tracker</NavItem>
                                    </>
                                )}

                                {user && user.role === 'doctor' && (
                                    <>
                                        <NavItem to="/doctor/dashboard">Dashboard</NavItem>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center space-x-4">
                            <button
                                onClick={toggleTheme}
                                onMouseEnter={() => setHoveredElement('theme')}
                                onMouseLeave={() => setHoveredElement(null)}
                                className="p-2 rounded-full transition-colors focus:outline-none"
                                style={{
                                    backgroundColor: hoveredElement === 'theme' ? 'var(--bg-subtle)' : 'transparent',
                                    color: 'var(--txt-primary)'
                                }}
                                aria-label="Toggle Dark Mode"
                            >
                                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                            </button>
                            {user && user.name ? (
                                <>
                                    <div className="hidden sm:flex items-center space-x-2 text-sm text-text-muted">
                                        <div className="w-2 h-2 rounded-full bg-green-400"></div>
                                        <span>{user.name}</span>
                                        <span className="text-xs px-2 py-0.5 bg-gray-100 rounded-full uppercase tracking-wider">{user.role}</span>
                                    </div>
                                    <Button
                                        variant="secondary"
                                        size="sm"
                                        onClick={handleLogout}
                                        className="!px-4"
                                    >
                                        Logout
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Link
                                        to="/login"
                                        onMouseEnter={() => setHoveredElement('login')}
                                        onMouseLeave={() => setHoveredElement(null)}
                                        className="inline-flex items-center justify-center font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 px-3 py-1.5 text-sm rounded-lg"
                                        style={{
                                            backgroundColor: hoveredElement === 'login' ? 'var(--bg-subtle)' : 'transparent',
                                            color: hoveredElement === 'login' ? 'var(--txt-primary)' : 'var(--text-secondary)'
                                        }}
                                    >
                                        Login
                                    </Link>
                                    <Link to="/signup">
                                        <Button size="sm">Get Started</Button>
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </nav>
            {location.pathname !== '/' && (
                <div className="h-16 sm:h-20" />
            )}
        </>
    );
};

export default Navbar;
