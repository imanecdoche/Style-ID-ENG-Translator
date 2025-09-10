import React from 'react';

interface ContextAnalysisCardProps {
    analysis: string;
}

const LightBulbIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.311a7.5 7.5 0 0 1-7.5 0c-1.42 0-2.798-.36-4.09-1.025a7.5 7.5 0 0 1 15.18 0c-1.292.665-2.67 1.025-4.09 1.025Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.311a7.5 7.5 0 0 1-7.5 0c-1.42 0-2.798-.36-4.09-1.025a7.5 7.5 0 0 1 15.18 0c-1.292.665-2.67 1.025-4.09 1.025Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 12.75a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 12.75a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.311a7.5 7.5 0 0 1-7.5 0c-1.42 0-2.798-.36-4.09-1.025a7.5 7.5 0 0 1 15.18 0c-1.292.665-2.67 1.025-4.09 1.025Z" />
    </svg>
);


export const ContextAnalysisCard: React.FC<ContextAnalysisCardProps> = ({ analysis }) => {
    return (
        <div className="bg-gray-800/70 border border-teal-500/30 rounded-lg p-4 mb-8 animate-fade-in">
            <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                    <LightBulbIcon className="w-6 h-6 text-teal-400 mt-1" />
                </div>
                <div>
                    <h3 className="text-md font-bold text-teal-300">Pemahaman Konteks oleh AI</h3>
                    <p className="text-sm text-gray-300 mt-1 italic">
                        {analysis}
                    </p>
                </div>
            </div>
        </div>
    );
};