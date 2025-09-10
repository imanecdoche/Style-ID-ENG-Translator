import React, { useState } from 'react';

interface TranslationCardProps {
    baseStyle: string;
    variations: string[];
}

const ClipboardIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a2.25 2.25 0 0 1-2.25 2.25h-1.5a2.25 2.25 0 0 1-2.25-2.25v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184" />
    </svg>
);

const CheckIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
    </svg>
);


export const TranslationCard: React.FC<TranslationCardProps> = ({ baseStyle, variations }) => {
    const [copied, setCopied] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);

    const activeTranslation = variations[activeIndex] || '';

    const handleCopy = () => {
        if (!activeTranslation) return;
        navigator.clipboard.writeText(activeTranslation).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    return (
        <div className="bg-gray-800 rounded-lg shadow-md overflow-hidden flex flex-col">
            <div className="p-4 bg-gray-700/50 flex justify-between items-center">
                <h3 className="text-md font-bold text-teal-300 truncate" title={baseStyle}>{baseStyle}</h3>
                <button 
                    onClick={handleCopy}
                    className="text-gray-400 hover:text-white transition-colors duration-200"
                    title="Copy to clipboard"
                    aria-label="Copy translation to clipboard"
                >
                    {copied ? <CheckIcon className="w-5 h-5 text-green-400"/> : <ClipboardIcon className="w-5 h-5" />}
                </button>
            </div>
            
            {variations.length > 1 && (
                <div className="border-b border-gray-700 px-2 pt-2">
                    <div className="flex -mb-px space-x-2">
                        {variations.map((_, index) => (
                             <button
                                key={index}
                                onClick={() => setActiveIndex(index)}
                                className={`py-2 px-3 text-xs font-medium rounded-t-md transition-colors ${
                                    activeIndex === index 
                                    ? 'bg-gray-800 text-teal-300 border-b-2 border-teal-400' 
                                    : 'text-gray-400 hover:bg-gray-700/50'
                                }`}
                                aria-current={activeIndex === index ? 'page' : undefined}
                            >
                                Variation {index + 1}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            <div className="p-4 flex-grow min-h-[100px]">
                <p className="text-gray-200 whitespace-pre-wrap">{activeTranslation}</p>
            </div>
        </div>
    );
};