import React from 'react';

interface HumanizeSliderProps {
    level: number;
    setLevel: (level: number) => void;
}

export const HumanizeSlider: React.FC<HumanizeSliderProps> = ({ level, setLevel }) => {
    
    const getLevelLabel = (value: number) => {
        if (value === 0) return 'Off';
        if (value <= 25) return 'Subtle';
        if (value <= 50) return 'Moderate';
        if (value <= 75) return 'Heavy';
        return 'Max';
    }

    return (
        <div className="bg-gray-800 border-2 border-gray-700 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
                <label htmlFor="humanize-level" className="text-lg font-semibold text-teal-300">
                    Humanize Level
                </label>
                <span className="text-sm font-medium text-gray-300 bg-gray-700 px-2 py-1 rounded-md">
                    {getLevelLabel(level)}
                </span>
            </div>
             <p className="text-xs text-gray-400 mb-3">
                Make the translation sound more like a real person typed it. Higher levels will use more abbreviations, less punctuation, and lowercase letters.
            </p>
            <input
                id="humanize-level"
                type="range"
                min="0"
                max="100"
                value={level}
                onChange={(e) => setLevel(parseInt(e.target.value, 10))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer range-lg accent-teal-500"
            />
        </div>
    );
};