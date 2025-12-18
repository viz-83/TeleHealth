import { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const useAutoLogout = (timeoutMs = 15 * 60 * 1000) => { // Default 15 minutes
    const navigate = useNavigate();

    const logout = useCallback(() => {
        const token = localStorage.getItem('token');
        if (token) {
            console.log('Auto-logging out due to inactivity...');
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            alert('You have been logged out due to inactivity.');
            navigate('/login');
        }
    }, [navigate]);

    useEffect(() => {
        let timeoutId;

        const resetTimer = () => {
            if (timeoutId) clearTimeout(timeoutId);
            timeoutId = setTimeout(logout, timeoutMs);
        };

        // Events to track activity
        const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];

        // Initial timer start
        resetTimer();

        // Add event listeners
        events.forEach(event => {
            window.addEventListener(event, resetTimer);
        });

        // Cleanup
        return () => {
            if (timeoutId) clearTimeout(timeoutId);
            events.forEach(event => {
                window.removeEventListener(event, resetTimer);
            });
        };
    }, [logout, timeoutMs]);

    return null; // This hook doesn't render anything
};

export default useAutoLogout;
