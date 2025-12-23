import React, { useState, useEffect, useRef } from 'react';
import { X, Send, Sparkles } from 'lucide-react';
import ChatMessage from './ChatMessage';
import axiosInstance from '../../utils/axiosInstance';
import { useNavigate } from 'react-router-dom';

const AIAssistantPanel = ({ isOpen, onClose }) => {
    const navigate = useNavigate();
    const [messages, setMessages] = useState([
        {
            text: "Hi 👋 I'm here to help you find the care you need.\n\nI can help you understand symptoms, find doctors, or book tests. How can I help?",
            isUser: false,
            actions: [
                { label: "Check Symptoms", action: "SYMPTOM_START" },
                { label: "Find a Doctor", action: "NAVIGATE", payload: "/find-doctors" },
                { label: "Book Tests", action: "NAVIGATE", payload: "/tests" }
            ]
        }
    ]);
    const [inputValue, setInputValue] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (isOpen) scrollToBottom();
    }, [messages, isOpen]);

    const handleSendMessage = async (text) => {
        if (!text.trim()) return;

        // Add user message
        const userMsg = { text: text, isUser: true };
        setMessages(prev => [...prev, userMsg]);
        setInputValue("");
        setIsLoading(true);

        try {
            const res = await axiosInstance.post('/api/v1/assistant/message', {
                message: text,
                context: {}
            });

            const aiData = res.data.data;
            const aiMsg = {
                text: aiData.message,
                isUser: false,
                actions: aiData.suggestedActions
            };
            setMessages(prev => [...prev, aiMsg]);
        } catch (error) {
            console.error("AI Assistant Error:", error);
            setMessages(prev => [...prev, {
                text: "I'm having trouble connecting right now. Please try again later.",
                isUser: false
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleActionClick = (action) => {
        if (action.action === 'NAVIGATE') {
            navigate(action.payload);
            // Optional: close panel on navigation?
            // onClose(); 
            // Better to keep open or minimize? Let's keep open for context but maybe add a system message "Navigating..."
        } else if (action.action === 'SYMPTOM_START') {
            handleSendMessage("I want to check my symptoms.");
        } else {
            handleSendMessage(action.label);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage(inputValue);
        }
    };

    return (
        <>
            {/* Panel */}
            <div className={`
                fixed bottom-24 right-6 w-[90vw] sm:w-[380px] h-[600px] max-h-[80vh] 
                bg-white dark:bg-surface shadow-2xl z-[100] rounded-2xl overflow-hidden flex flex-col
                transform transition-all duration-300 ease-in-out origin-bottom-right
                ${isOpen ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-8 opacity-0 scale-95 pointer-events-none'}
            `}>
                {/* Header */}
                <div className="px-6 py-4 bg-white dark:bg-surface border-b border-gray-100 dark:border-white/5 flex justify-between items-center shrink-0">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-white dark:bg-background-subtle border border-secondary dark:border-white/10 flex items-center justify-center text-cta dark:text-cta-hover">
                            <Sparkles size={16} fill="currentColor" />
                        </div>
                        <div>
                            <h3 className="font-heading font-bold" style={{ color: 'var(--txt-primary)' }}>Care Assistant</h3>
                            <p className="text-[10px] text-gray-500 dark:text-text-secondary uppercase tracking-wider font-semibold">AI-Powered · Not a Diagnosis</p>
                        </div>
                    </div>

                </div>

                {/* Messages Body */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-gray-50 dark:bg-background-light">
                    {messages.map((msg, idx) => (
                        <ChatMessage
                            key={idx}
                            message={msg.text}
                            isUser={msg.isUser}
                            actions={msg.actions}
                            onActionClick={handleActionClick}
                        />
                    ))}

                    {isLoading && (
                        <div className="flex items-center gap-2 p-4 text-xs text-gray-500 dark:text-gray-400 animate-pulse">
                            <div className="w-2 h-2 bg-cta/40 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-cta/40 rounded-full animate-bounce delay-150"></div>
                            <div className="w-2 h-2 bg-cta/40 rounded-full animate-bounce delay-300"></div>
                            <span>Thinking...</span>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Footer */}
                <div className="p-4 bg-white dark:bg-surface border-t border-gray-100 dark:border-white/5 shrink-0">
                    <div className="relative flex items-end gap-2 bg-white dark:bg-background-subtle rounded-3xl p-2 pr-2 border border-gray-200 dark:border-white/5 focus-within:border-cta/50 transition-all shadow-sm">
                        <textarea
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Ask about symptoms, doctors..."
                            className="w-full bg-transparent border-none focus:ring-0 text-sm p-3 max-h-32 resize-none placeholder:text-gray-500 dark:placeholder:text-gray-400"
                            style={{ color: 'var(--txt-primary)' }}
                            disabled={isLoading}
                            rows={1}
                        />
                        <button
                            onClick={() => handleSendMessage(inputValue)}
                            disabled={!inputValue.trim() || isLoading}
                            className={`
                                p-3 rounded-full flex items-center justify-center transition-all duration-200 shrink-0 mb-0.5
                                ${!inputValue.trim() || isLoading
                                    ? 'bg-gray-100 dark:bg-white/5 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                                    : 'bg-cta text-white shadow-lg hover:bg-cta-hover hover:scale-105 active:scale-95'}
                            `}
                        >
                            <Send size={18} />
                        </button>
                    </div>
                    <p className="text-[10px] text-center text-gray-400 dark:text-text-muted mt-2 opacity-70">
                        MedSync AI can make mistakes. Please consult a doctor for medical advice.
                    </p>
                </div>
            </div>
        </>
    );
};

export default AIAssistantPanel;
