import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Button from '../components/ui/Button';
import { FaSpa, FaHeart } from 'react-icons/fa';

import { useTheme } from '../context/ThemeContext';

const WellbeingLanding = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = React.useState(true);
    const { theme } = useTheme();

    React.useEffect(() => {
        const hasSeenDisclaimer = sessionStorage.getItem('hasSeenWellbeingDisclaimer');
        if (hasSeenDisclaimer) {
            navigate('/wellbeing/chat', { replace: true });
        } else {
            setIsLoading(false);
        }
    }, [navigate]);

    const handleEnter = () => {
        sessionStorage.setItem('hasSeenWellbeingDisclaimer', 'true');
        navigate('/wellbeing/chat');
    };

    if (isLoading) return null;

    return (
        <div className={`h-screen font-body flex flex-col overflow-hidden transition-colors duration-300 pt-16 sm:pt-20
            ${theme === 'dark' ? 'bg-gray-900' : 'bg-[#f0fdfa]'}
        `}>
            <Navbar />

            <div className="flex-1 flex items-center justify-center p-4">

                <div className={`max-w-4xl w-full rounded-2xl shadow-xl overflow-hidden relative border flex flex-col md:flex-row
                    ${theme === 'dark' ? 'bg-gray-800 border-white/5' : 'bg-white border-white/50'}
                `}>
                    {/* Decorative Header / Side Image */}
                    <div className={`h-24 md:h-auto md:w-1/3 flex items-center justify-center relative overflow-hidden
                        ${theme === 'dark' ? 'bg-teal-800/30' : 'bg-teal-100'}
                    `}>

                        <div className={`absolute inset-0 
                            ${theme === 'dark' ? 'bg-transparent' : 'bg-gradient-to-r from-teal-100/50 to-green-100/50'}
                        `}></div>
                        <div className={`z-10 p-4 rounded-full shadow-sm
                            ${theme === 'dark' ? 'bg-gray-700' : 'bg-cta'}
                        `}>
                            <FaSpa className="text-white text-3xl md:text-5xl" />
                        </div>
                    </div>

                    <div className="p-6 md:p-10 text-center md:text-left flex-1 flex flex-col justify-center">
                        <h1 className={`text-2xl md:text-3xl font-heading font-bold mb-2
                            ${theme === 'dark' ? 'text-white' : 'text-gray-900'}
                        `}>
                            Wellbeing Space
                        </h1>
                        <p className={`text-base mb-6 leading-relaxed
                            ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}
                        `}>
                            A calm space to pause, reflect, and feel supported.
                        </p>

                        <div className={`border rounded-xl p-4 mb-6 text-left
                            ${theme === 'dark' ? 'bg-teal-900/10 border-teal-900/20' : 'bg-teal-50 border-teal-100'}
                        `}>
                            <div className="flex items-start gap-3">
                                <FaHeart className="text-cta mt-1 shrink-0" />
                                <div className="space-y-2">
                                    <h3 className={`font-bold text-sm ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>Important Note</h3>
                                    <p className={`text-xs leading-relaxed ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                        This space offers emotional support and reflection.
                                        It is <strong>not a substitute for professional mental healthcare</strong>.
                                    </p>
                                    <p className={`text-xs leading-relaxed ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                        If you’re in immediate danger, please seek local emergency help or call <strong>112</strong> (National Emergency Number) or <strong>14416</strong> (Tele Manas).
                                    </p>
                                </div>

                            </div>
                        </div>

                        <Button
                            size="lg"
                            className={`w-full md:w-auto px-8 text-white shadow-lg text-sm
                                ${theme === 'dark' ? 'bg-teal-600 hover:bg-teal-700 shadow-none' : 'bg-cta hover:bg-teal-700 shadow-teal-200/50'}
                            `}
                            onClick={handleEnter}
                        >
                            I Understand & Continue
                        </Button>
                    </div>
                </div>
            </div>


        </div>
    );
};


export default WellbeingLanding;
