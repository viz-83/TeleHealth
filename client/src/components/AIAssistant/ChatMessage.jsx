import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bot, User } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const ActionChip = ({ action, onClick }) => {
    const [isHovered, setIsHovered] = React.useState(false);

    return (
        <button
            onClick={() => onClick(action)}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="px-3 py-1.5 border border-cta/20 dark:border-cta/40 text-cta dark:text-cta-hover text-xs font-semibold rounded-full transition-colors shadow-sm"
            style={{
                backgroundColor: isHovered ? 'var(--bg-subtle)' : 'var(--bg-surface)'
            }}
        >
            {action.label}
        </button>
    );
};

const ChatMessage = ({ message, isUser, actions, onActionClick }) => {
    return (
        <div className={`flex w-full mb-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex max-w-[85%] ${isUser ? 'flex-row-reverse' : 'flex-row'} gap-3 items-start`}>

                {/* Avatar */}
                <div className={`
                    w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm border
                    ${isUser
                        ? 'bg-white dark:bg-background-subtle text-gray-600 dark:text-gray-300 border-gray-200 dark:border-white/10'
                        : 'bg-white dark:bg-background-subtle text-cta dark:text-cta-hover border-cta/20 dark:border-white/10'}
                `}>
                    {isUser ? <User size={16} /> : <Bot size={16} />}
                </div>

                {/* Message Bubble */}
                <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
                    <div className={`
                        p-4 rounded-2xl text-sm leading-relaxed shadow-sm border
                        ${isUser
                            ? 'bg-cta text-white border-cta rounded-tr-none'
                            : 'bg-white dark:bg-surface text-text-primary dark:text-text-primary border-gray-100 dark:border-white/5 rounded-tl-none'}
                    `}>
                        {/* Render simple markdown/text */}
                        <div className="prose prose-sm max-w-none dark:prose-invert">
                            <ReactMarkdown>{message}</ReactMarkdown>
                        </div>
                    </div>

                    {/* Suggested Actions (Only for AI) */}
                    {!isUser && actions && actions.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3">
                            {actions.map((action, idx) => (
                                <ActionChip
                                    key={idx}
                                    action={action}
                                    onClick={onActionClick}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ChatMessage;
