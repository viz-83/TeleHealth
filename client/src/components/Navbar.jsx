import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Button from './ui/Button';
import medsyncLogo from '../assets/medsync_logo.png';
import { Sun, Moon, Menu, X } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';



const Navbar = () => {
    const { theme, toggleTheme } = useTheme();
    const { user, logout } = useAuth();

    const navigate = useNavigate();
    const location = useLocation();
    const [scrolled, setScrolled] = useState(false);
    const [hoveredElement, setHoveredElement] = useState(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Close mobile menu on route change
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [location.pathname]);

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
        logout();
        navigate('/login');
    };

    // Helper to check active state
    const isActive = (path) => location.pathname === path;

    const NavItem = ({ to, children }) => (
        <Link
            to={to}
            className={`
                group relative text-sm font-medium transition-colors duration-200 px-3 py-2 block whitespace-nowrap
                ${isActive(to)
                    ? 'text-cta font-semibold 2xl:bg-transparent bg-cta/5 2xl:bg-none rounded-lg 2xl:rounded-none'
                    : 'text-text-secondary hover:text-cta hover:bg-gray-50 dark:hover:bg-white/5 2xl:hover:bg-transparent rounded-lg 2xl:rounded-none'}
            `}
        >
            {children}
            <span className={`
                absolute bottom-0 left-0 h-0.5 bg-cta transition-all duration-300 ease-out hidden 2xl:block
                ${isActive(to) ? 'w-full' : 'w-0 group-hover:w-full group-hover:opacity-50'}
            `} />
        </Link>
    );

    return (
        <>
            <nav className={`
                fixed top-0 w-full z-50 transition-all duration-300
                ${scrolled ? 'bg-surface/95 backdrop-blur-sm shadow-sm border-b border-gray-200 dark:border-white/5' : 'bg-transparent'}
            `}>
                <div className="w-full mx-auto px-6 sm:px-10 2xl:px-20">
                    <div className="flex justify-between items-center h-16 sm:h-20">

                        {/* 1. Left Section: Logo */}
                        <div className="flex-shrink-0">
                            <Link to={user && user.name ? "/dashboard" : "/"} className="flex items-center space-x-0.5">
                                <img src={medsyncLogo} alt="MedSync Logo" className="w-14 h-14 object-contain" />
                                <span className="text-xl font-heading font-bold text-cta block">
                                    MedSync
                                </span>
                            </Link>
                        </div>

                        {/* 2. Center Section: Navigation Links (Desktop) */}
                        <div className="hidden 2xl:flex flex-1 justify-center items-center gap-1 mx-2">
                            {user && user.role === 'patient' && (
                                <>
                                    <NavItem to="/symptom-checker">Symptom Checker</NavItem>
                                    <NavItem to="/find-doctors">Find Doctors</NavItem>
                                    <NavItem to="/my-appointments">Appointments</NavItem>
                                    <NavItem to="/patient/health-tracker">Health Tracker</NavItem>
                                    <NavItem to="/medicines">Pharmacy</NavItem>
                                    <NavItem to="/tests">Lab Tests</NavItem>
                                    <NavItem to="/wellbeing">Wellbeing</NavItem>

                                </>
                            )}

                            {user && user.role === 'doctor' && (
                                <>
                                    <NavItem to="/doctor/dashboard">Dashboard</NavItem>
                                </>
                            )}
                        </div>

                        {/* 3. Right Section: Theme & Auth */}
                        <div className="hidden 2xl:flex items-center space-x-3 flex-shrink-0">
                            <button
                                onClick={toggleTheme}
                                onMouseEnter={() => setHoveredElement('theme')}
                                onMouseLeave={() => setHoveredElement(null)}
                                className="hidden md:block p-2 rounded-full transition-colors focus:outline-none"
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
                                    <div className="hidden md:flex items-center space-x-2 text-sm text-text-muted whitespace-nowrap">
                                        <div className="w-2 h-2 rounded-full bg-green-400"></div>
                                        <span className="truncate max-w-[100px]">{user.name}</span>
                                        <span className="text-xs px-2 py-0.5 bg-gray-100 rounded-full uppercase tracking-wider">{user.role}</span>
                                    </div>
                                    <div className="hidden md:block">
                                        <Button
                                            variant="secondary"
                                            size="sm"
                                            onClick={handleLogout}
                                            className="!px-4 ml-2"
                                        >
                                            Logout
                                        </Button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="hidden md:flex items-center gap-4">

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
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Mobile Menu Toggle */}
                        <div className="2xl:hidden flex items-center ml-4">
                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="p-2 rounded-lg text-text-secondary hover:bg-gray-100 dark:hover:bg-white/5 transition-colors focus:outline-none"
                                aria-label="Toggle Menu"
                            >
                                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu Overlay */}
                {isMobileMenuOpen && (
                    <div className="2xl:hidden absolute top-16 left-0 w-full bg-surface border-b border-gray-100 dark:border-gray-700 shadow-lg animate-slideDown origin-top z-40">
                        <div className="px-4 pt-4 pb-6 space-y-2">
                            {user && user.role === 'patient' && (
                                <>
                                    <NavItem to="/symptom-checker">Symptom Checker</NavItem>
                                    <NavItem to="/find-doctors">Find Doctors</NavItem>
                                    <NavItem to="/my-appointments">Appointments</NavItem>
                                    <NavItem to="/patient/health-tracker">Health Tracker</NavItem>
                                    <NavItem to="/medicines">Pharmacy</NavItem>
                                    <NavItem to="/tests">Lab Tests</NavItem>
                                    <NavItem to="/wellbeing">Wellbeing</NavItem>

                                </>
                            )}
                            {user && user.role === 'doctor' && (
                                <NavItem to="/doctor/dashboard">Dashboard</NavItem>
                            )}

                            {user && user.name && (
                                <div className="pt-4 mt-2 border-t border-gray-100 dark:border-gray-700">
                                    <div className="flex items-center gap-3 px-3 mb-3">
                                        <div className="w-8 h-8 rounded-full bg-green-400 flex items-center justify-center text-white font-bold shadow-sm">
                                            {user.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-text-primary">{user.name}</p>
                                            <p className="text-xs text-text-secondary uppercase tracking-wider">{user.role}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full text-left px-3 py-2 text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-colors flex items-center gap-2"
                                    >
                                        Logout
                                    </button>
                                </div>
                            )}
                            {/* Mobile Auth Buttons if needed extra visibility, but they are already in top bar. 
                                Actually, hiding top bar auth buttons on mobile might be better if space is tight.
                                But keeping them visible is okay for now.
                            */}

                            <button
                                onClick={toggleTheme}
                                className="w-full text-left px-3 py-2 text-sm font-medium text-text-secondary hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg transition-colors flex items-center justify-between"
                            >
                                <span>Dark Mode</span>
                                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                            </button>

                            {!user.name && (
                                <div className="pt-4 mt-2 border-t border-gray-100 dark:border-gray-700 space-y-2">
                                    <Link to="/login" className="block w-full text-center py-2 text-sm font-semibold text-text-primary bg-gray-50 dark:bg-white/5 rounded-lg">
                                        Login
                                    </Link>
                                    <Link to="/signup" className="block w-full">
                                        <Button className="w-full justify-center" size="sm">Get Started</Button>
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </nav >
            {
                location.pathname !== '/' && location.pathname !== '/dashboard' && (
                    <div className="h-16 sm:h-20" />
                )
            }
        </>
    );
};

export default Navbar;
