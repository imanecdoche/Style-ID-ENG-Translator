
import React from 'react';

const SparklesIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715.93 9.75l.93-1.035a3.75 3.75 0 0 0-2.632-2.632L15 6l1.035-.93a3.75 3.75 0 0 0-2.632-2.632L12 2.25l-.93 1.035a3.75 3.75 0 0 0-2.632 2.632L6 9l1.035.93a3.75 3.75 0 0 0 2.632 2.632L10.5 15l.93-1.035a3.75 3.75 0 0 0 2.632-2.632L15 9l-1.035-.93a3.75 3.75 0 0 0-2.632-2.632Z" />
    </svg>
);


export const Header: React.FC = () => {
    return (
        <header className="bg-gray-800/50 py-4 shadow-lg backdrop-blur-md sticky top-0 z-10">
            <div className="container mx-auto px-4 max-w-7xl">
                <div className="flex items-center gap-4">
                    <SparklesIcon className="w-10 h-10 text-teal-400" />
                    <div>
                        <h1 className="text-2xl font-bold text-white">Penerjemah Gaya</h1>
                        <p className="text-sm text-gray-400">Indonesian to English Style Translator</p>
                    </div>
                </div>
            </div>
        </header>
    );
};
