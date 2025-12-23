import React from 'react';
import Card from './Card';

const ServiceCard = ({ title, description, icon: Icon, onClick }) => (
    <Card className="group hover:-translate-y-2 transition-all duration-500 cursor-pointer border-0 dark:border dark:border-white/5 shadow-soft hover:shadow-xl bg-surface overflow-hidden" onClick={onClick}>
        <div className="p-8 flex flex-col h-full relative">
            <div className="absolute top-0 right-0 w-24 h-24 bg-secondary/10 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-150 duration-700"></div>

            <div className="w-14 h-14 bg-background-subtle rounded-2xl flex items-center justify-center text-cta mb-6 group-hover:bg-cta group-hover:text-white transition-colors duration-300 z-10">
                <Icon size={24} />
            </div>

            <h3 className="text-xl font-heading font-bold text-text-primary mb-3 group-hover:text-cta transition-colors">{title}</h3>
            <p className="text-text-secondary leading-relaxed mb-6 flex-1">{description}</p>

            <div className="flex items-center text-cta font-medium text-sm group-hover:underline decoration-2 underline-offset-4">
                Access Feature
                <svg className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
            </div>
        </div>
    </Card>
);

export default ServiceCard;
