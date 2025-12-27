import React, { useState, useRef, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Button from '../components/ui/Button';
import { Send, AlertTriangle, Phone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';


import { useTheme } from '../context/ThemeContext';


const WellbeingChat = () => {
    const { theme } = useTheme();
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [crisisMode, setCrisisMode] = useState(false);


    const messagesEndRef = useRef(null);
    const navigate = useNavigate();

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Initial greeting
    useEffect(() => {
        // Mock a friendly start if empty
        if (messages.length === 0) {
            setMessages([
                {
                    role: 'model',
                    text: "Hi there. I'm here to listen and support you. You can share whatever is on your mind.",
                    timestamp: new Date()
                }
            ]);
        }
    }, [messages.length]);

    const handleSend = async () => {
        if (!input.trim() || crisisMode) return;
        const userText = input;
        setInput('');

        // Add user message
        const newHistory = [...messages, { role: 'user', text: userText, timestamp: new Date() }];
        setMessages(newHistory);
        setIsTyping(true);

        try {
            const res = await axiosInstance.post('/api/v1/wellbeing/message', {
                message: userText,
                // Send history excluding the current new message
                history: newHistory.slice(0, -1).filter(m => m.role !== 'system').slice(-10)
            });

            const data = res.data;


            if (data.status === 'success') {
                const aiResponse = data.data;

                // Add AI message
                setMessages(prev => [...prev, {
                    role: 'model',
                    text: aiResponse.message,
                    timestamp: new Date()
                }]);

                // Check Crisis Flags
                if (aiResponse.flags?.isCrisis) {
                    setCrisisMode(true);
                }

                if (aiResponse.flags?.isFallback) {
                    // Optional: Show value added toast or indicator, but message content takes care of it.
                    console.warn("Using offline fallback");
                }

            } else {
                // Handle error gracefully
                setMessages(prev => [...prev, {
                    role: 'system',
                    text: "I'm having trouble connecting right now. Please check your internet or try again later.",
                    timestamp: new Date()
                }]);
            }

        } catch (err) {
            console.error(err);
            setMessages(prev => [...prev, {
                role: 'system',
                text: "Something went wrong. Please try again.",
                timestamp: new Date()
            }]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <div className={`h-screen flex flex-col font-body overflow-hidden transition-colors duration-300 ${theme === 'dark' ? 'bg-gray-900' : 'bg-[#f0fdfa]'}`}>





            <Navbar />

            <div className="flex-1 max-w-4xl mx-auto w-full p-4 flex flex-col overflow-hidden">

                {/* Header */}
                <div className={`backdrop-blur-md p-4 rounded-t-3xl shadow-sm border-b flex justify-between items-center z-10 
                    ${theme === 'dark' ? 'bg-gray-800/80 border-white/5' : 'bg-cta border-teal-700'}
                `}>
                    <div>
                        <h2 className={`text-xl font-heading font-bold ${theme === 'dark' ? 'text-teal-400' : 'text-white'}`}>Wellbeing Support</h2>
                        <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-teal-50'}`}>AI-powered support · Not medical advice</p>
                    </div>
                </div>

                {/* Crisis Banner */}
                {crisisMode && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4 rounded-r-md mt-4 animate-pulse">
                        <div className="flex items-start">
                            <AlertTriangle className="text-red-500 shrink-0 mt-0.5 mr-3" />
                            <div>
                                <h3 className="text-red-800 font-bold">Please Get Immediate Help</h3>
                                <p className="text-red-700 text-sm mt-1">
                                    Ideally, we want you to be safe. Please contact emergency services or a loved one.
                                </p>
                                <div className="mt-3 flex gap-3">
                                    <Button variant="danger" size="sm" onClick={() => window.location.href = 'tel:112'}>
                                        <Phone size={14} className="mr-2" /> Call 112 (Emergency)
                                    </Button>

                                    <Button variant="outline" size="sm" onClick={() => navigate('/find-doctors')}>
                                        Find Professional Help
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Chat Area */}
                <div className={`flex-1 overflow-y-auto p-4 space-y-6 rounded-b-3xl 
                    ${theme === 'dark' ? 'bg-gray-900/50' : 'bg-white/50'}
                `}>
                    {messages.map((msg, idx) => (
                        <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`
                                max-w-[85%] sm:max-w-[70%] p-4 rounded-2xl shadow-sm text-sm sm:text-base leading-relaxed whitespace-pre-wrap
                                ${msg.role === 'user'
                                    ? theme === 'dark'
                                        ? 'bg-teal-900/50 text-teal-100 border border-teal-800 rounded-br-none'
                                        : 'bg-white text-teal-900 border border-teal-100 rounded-br-none'
                                    : msg.role === 'system'
                                        ? 'bg-gray-200 text-gray-600 text-center w-full max-w-full italic'
                                        : theme === 'dark'
                                            ? 'bg-gray-800 text-white rounded-bl-none border border-gray-700'
                                            : 'bg-teal-50 text-teal-900 rounded-bl-none border border-teal-100'} 
                            `}>







                                {msg.text}
                            </div>
                        </div>
                    ))}



                    {isTyping && (
                        <div className="flex justify-start">
                            <div className={`p-4 rounded-2xl rounded-bl-none border shadow-sm flex gap-1
                                ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}
                            `}>
                                <span className="w-2 h-2 bg-teal-400 rounded-full animate-bounce"></span>
                                <span className="w-2 h-2 bg-teal-400 rounded-full animate-bounce delay-75"></span>
                                <span className="w-2 h-2 bg-teal-400 rounded-full animate-bounce delay-150"></span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                {!crisisMode && (
                    <div className={`mt-4 p-2 sm:p-3 rounded-full shadow-lg border flex items-center gap-2
                        ${theme === 'dark' ? 'bg-gray-800 border-white/5' : 'bg-white border-gray-100'}
                    `}>
                        <input
                            type="text"
                            className={`flex-1 bg-transparent border-none focus:ring-0 px-4 py-2 placeholder:text-gray-400 
                                ${theme === 'dark' ? 'text-white' : 'text-text-primary'}
                            `}
                            placeholder="Share what’s been on your mind…"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            disabled={isTyping}
                        />
                        <button
                            onClick={handleSend}
                            disabled={!input.trim() || isTyping}
                            className="bg-teal-600 hover:bg-teal-700 text-white p-3 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Send size={20} />
                        </button>
                    </div>
                )}


                <div className="text-center mt-2">
                    <p className="text-xs text-gray-400">If you are in danger, please call emergency services immediately.</p>
                </div>

            </div>
        </div>
    );
};

export default WellbeingChat;
