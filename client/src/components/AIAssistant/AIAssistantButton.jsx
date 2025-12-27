import React, { useState } from 'react';
import { MessageCircle, Sparkles } from 'lucide-react';
import { useLocation } from 'react-router-dom'; // Import useLocation
import AIAssistantPanel from './AIAssistantPanel';

const AIAssistantButton = () => {
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);

    // Initial tooltip state - show for 5s then hide
    const [showTooltip, setShowTooltip] = useState(true);

    // Hide on auth pages and during calls/chats
    const hideOnRoutes = ['/login', '/signup', '/verify-otp', '/doctor/onboarding'];

    // Regex for dynamic routes (video call and chat)
    const hidePatterns = [
        /^\/appointments\/[^/]+\/call$/, // Matches /appointments/:id/call
        /^\/appointments\/[^/]+\/chat$/, // Matches /appointments/:id/chat
        /^\/wellbeing/ // Matches /wellbeing and /wellbeing/chat
    ];


    if (hideOnRoutes.includes(location.pathname) || hidePatterns.some(pattern => pattern.test(location.pathname))) {
        return null;
    }

    return (
        <>
            {/* The Floating Button */}
            <div className="fixed bottom-6 right-6 z-[80] flex flex-col items-end gap-2 pointer-events-none">

                {/* Tooltip / Prompt */}
                {showTooltip && (
                    <div className="bg-white dark:bg-background-subtle px-4 py-2.5 rounded-xl shadow-soft text-sm font-medium text-text-primary dark:text-text-primary mr-2 animate-bounce-slow origin-bottom-right border border-gray-100 dark:border-gray-700 pointer-events-auto">
                        Hi! Need help? 👋
                        {/* Triangle */}
                        <div className="absolute -bottom-1.5 right-6 w-3 h-3 bg-white dark:bg-background-subtle rotate-45 border-r border-b border-gray-100 dark:border-gray-700"></div>
                    </div>
                )}

                <button
                    onClick={() => {
                        setIsOpen(!isOpen);
                        if (!isOpen) setShowTooltip(false);
                    }}
                    className="pointer-events-auto group relative flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-cta text-white shadow-lg shadow-cta/30 hover:shadow-xl hover:scale-110 active:scale-95 transition-all duration-300"
                    aria-label="Open Care Assistant"
                >
                    <div className="absolute inset-0 rounded-full border border-white/20 animate-ping opacity-20"></div>
                    <Sparkles size={28} className="group-hover:rotate-12 transition-transform" />
                </button>
            </div>

            {/* The Panel Component */}
            <AIAssistantPanel isOpen={isOpen} onClose={() => setIsOpen(false)} />
        </>
    );
};

export default AIAssistantButton;
