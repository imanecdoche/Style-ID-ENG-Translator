import React from 'react';
import { PREDEFINED_STYLES } from '../constants';
import type { SelectedStyleConfig, CustomStyle } from '../types';
import { Spinner } from './Spinner';

interface StyleSelectorProps {
    selectedStyles: SelectedStyleConfig[];
    setSelectedStyles: React.Dispatch<React.SetStateAction<SelectedStyleConfig[]>>;
    customStyles: CustomStyle[];
    setCustomStyles: React.Dispatch<React.SetStateAction<CustomStyle[]>>;
    onValidateStyle: (id: string) => void;
}

const TrashIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.124-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.077-2.09.921-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
    </svg>
);
const CheckCircleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
);
const ExclamationTriangleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
    </svg>
);


export const StyleSelector: React.FC<StyleSelectorProps> = ({ selectedStyles, setSelectedStyles, customStyles, setCustomStyles, onValidateStyle }) => {
    
    const handleStyleToggle = (styleId: string) => {
        setSelectedStyles(prev => {
            const isSelected = prev.some(s => s.id === styleId);
            if (isSelected) {
                return prev.filter(s => s.id !== styleId);
            } else {
                return [...prev, { id: styleId, variations: 1 }];
            }
        });
    };

    const handleVariationChange = (styleId: string, variations: number) => {
        const newVariations = Math.max(1, Math.min(5, variations));
        setSelectedStyles(prev => 
            prev.map(s => s.id === styleId ? { ...s, variations: newVariations } : s)
        );
    };

    const addCustomStyle = () => {
        setCustomStyles(prev => [...prev, { id: `custom-${Date.now()}`, description: '', variations: 1, isValidating: false, isValid: null }]);
    };

    const updateCustomStyleDescription = (id: string, description: string) => {
        setCustomStyles(prev => 
            prev.map(cs => cs.id === id ? { ...cs, description, isValid: null, generatedDescription: undefined, validationError: undefined } : cs)
        );
    };
    
    const handleCustomVariationChange = (id: string, variations: number) => {
        const newVariations = Math.max(1, Math.min(5, variations));
        setCustomStyles(prev => 
            prev.map(cs => cs.id === id ? { ...cs, variations: newVariations } : cs)
        );
    };

    const removeCustomStyle = (id: string) => {
        setCustomStyles(prev => prev.filter(cs => cs.id !== id));
    };

    return (
        <div className="flex flex-col gap-4 h-full">
            <div>
                <h2 className="text-lg font-semibold text-teal-300 mb-2">Choose Predefined Styles</h2>
                <div className="bg-gray-800 border-2 border-gray-700 rounded-lg p-4 space-y-4">
                    {PREDEFINED_STYLES.map(style => {
                        const currentSelection = selectedStyles.find(s => s.id === style.id);
                        const isSelected = !!currentSelection;

                        return (
                            <div key={style.id} className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id={style.id}
                                        checked={isSelected}
                                        onChange={() => handleStyleToggle(style.id)}
                                        className="w-4 h-4 text-teal-600 bg-gray-700 border-gray-600 rounded focus:ring-teal-500 cursor-pointer"
                                    />
                                     <div className="relative group">
                                        <label htmlFor={style.id} className="ml-2 text-sm font-medium text-gray-300 cursor-pointer">{style.name}</label>
                                        <div role="tooltip" className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-60 p-3 bg-gray-900 text-gray-300 text-xs rounded-lg shadow-xl border border-gray-700 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none invisible group-hover:visible z-10">
                                            <p className="font-bold text-teal-300 mb-1">{style.name}</p>
                                            <p className="leading-relaxed">{style.description}</p>
                                            <div className="absolute w-2 h-2 bg-gray-900 transform rotate-45 top-full left-1/2 -translate-x-1/2 -mt-1 border-r border-b border-gray-700"></div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <label htmlFor={`${style.id}-variations`} className="text-xs text-gray-400">Variations:</label>
                                    <input
                                        type="number"
                                        id={`${style.id}-variations`}
                                        min="1"
                                        max="5"
                                        value={currentSelection?.variations || 1}
                                        disabled={!isSelected}
                                        onChange={(e) => handleVariationChange(style.id, parseInt(e.target.value, 10))}
                                        className="w-16 bg-gray-900 border border-gray-600 text-white text-sm rounded-lg focus:ring-teal-500 focus:border-teal-500 block p-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                                    />
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

            <div className="flex flex-col flex-grow min-h-0">
                <div className="flex justify-between items-center mb-2">
                    <h2 className="text-lg font-semibold text-teal-300">Define Custom Styles</h2>
                     <button onClick={addCustomStyle} className="text-sm bg-gray-700 hover:bg-gray-600 text-teal-300 font-semibold py-1 px-3 rounded-lg transition-colors duration-200">
                        + Add New
                    </button>
                </div>
                <div className="bg-gray-800 border-2 border-gray-700 rounded-lg p-4 space-y-4 flex-grow overflow-y-auto">
                    {customStyles.length === 0 && (
                        <div className="text-center text-gray-500 h-full flex items-center justify-center">
                            <p>Click "+ Add New" to create a custom style prompt.</p>
                        </div>
                    )}
                    {customStyles.map((cs, index) => (
                        <div key={cs.id} className="p-3 bg-gray-900/50 rounded-lg">
                            <div className="flex justify-between items-start">
                                <label htmlFor={cs.id} className="text-sm font-medium text-gray-400 mb-1 block">Custom Style #{index + 1}</label>
                                <button 
                                    onClick={() => removeCustomStyle(cs.id)}
                                    className="text-gray-500 hover:text-red-400 transition-colors"
                                    aria-label="Remove custom style"
                                >
                                    <TrashIcon className="w-5 h-5"/>
                                </button>
                            </div>
                            <textarea
                                id={cs.id}
                                rows={2}
                                value={cs.description}
                                onChange={(e) => updateCustomStyleDescription(cs.id, e.target.value)}
                                placeholder="e.g., 'like a pirate', 'as a 1920s detective'..."
                                className="w-full p-2 bg-gray-900 border border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors duration-200 resize-none text-sm"
                                disabled={cs.isValidating}
                            />
                             <div className="mt-2 flex flex-col items-start gap-2">
                                {!cs.isValidating && cs.isValid === null && (
                                     <button 
                                        onClick={() => onValidateStyle(cs.id)} 
                                        disabled={!cs.description.trim()}
                                        className="text-xs bg-gray-700 hover:bg-gray-600 text-teal-300 font-semibold py-1 px-3 rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                     >
                                        Validate Style
                                    </button>
                                )}
                                {cs.isValidating && (
                                    <div className="flex items-center gap-2 text-xs text-gray-400">
                                        <Spinner />
                                        <span>Validating...</span>
                                    </div>
                                )}
                                {cs.isValid === true && (
                                    <div className="w-full text-xs text-gray-300 bg-green-900/50 p-2 rounded-md border border-green-700/50">
                                        <div className="flex items-center gap-2 font-bold text-green-400">
                                            <CheckCircleIcon className="w-4 h-4" />
                                            Style Validated
                                        </div>
                                        <p className="mt-1 pl-6 italic">"{cs.generatedDescription}"</p>
                                    </div>
                                )}
                                {cs.isValid === false && cs.validationError && (
                                    <div className="w-full text-xs text-red-300 bg-red-900/50 p-2 rounded-md border border-red-700/50">
                                        <div className="flex items-center gap-2 font-bold text-red-400">
                                            <ExclamationTriangleIcon className="w-4 h-4" />
                                            Invalid Style
                                        </div>
                                        <p className="mt-1 pl-6">{cs.validationError}</p>
                                    </div>
                                )}
                                <div className="flex items-center gap-2 pl-1 pt-1">
                                    <label htmlFor={`${cs.id}-variations`} className={`text-xs transition-colors ${cs.isValid ? 'text-gray-400' : 'text-gray-600'}`}>Variations:</label>
                                    <input
                                        type="number"
                                        id={`${cs.id}-variations`}
                                        min="1"
                                        max="5"
                                        value={cs.variations}
                                        disabled={!cs.isValid}
                                        onChange={(e) => handleCustomVariationChange(cs.id, parseInt(e.target.value, 10))}
                                        className="w-16 bg-gray-900 border border-gray-600 text-white text-sm rounded-lg focus:ring-teal-500 focus:border-teal-500 block p-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};