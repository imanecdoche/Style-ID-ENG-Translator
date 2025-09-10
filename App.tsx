import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { StyleSelector } from './components/StyleSelector';
import { TranslationCard } from './components/TranslationCard';
import { HumanizeSlider } from './components/HumanizeSlider';
import { ContextAnalysisCard } from './components/ContextAnalysisCard';
import { getContextAnalysis, translateInStyles, validateAndDescribeStyle } from './services/geminiService';
import type { TranslationResultGroup, SelectedStyleConfig, CustomStyle } from './types';
import { PREDEFINED_STYLES } from './constants';

const App: React.FC = () => {
    const [inputText, setInputText] = useState<string>('');
    const [contextText, setContextText] = useState<string>('');
    const [selectedStyles, setSelectedStyles] = useState<SelectedStyleConfig[]>([
        { id: 'formal-british', variations: 1 },
        { id: 'slang-american', variations: 1 }
    ]);
    const [customStyles, setCustomStyles] = useState<CustomStyle[]>([]);
    const [translations, setTranslations] = useState<TranslationResultGroup[]>([]);
    const [contextAnalysis, setContextAnalysis] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [humanizeLevel, setHumanizeLevel] = useState<number>(0);

    const handleValidateStyle = useCallback(async (id: string) => {
        const styleToValidate = customStyles.find(cs => cs.id === id);
        if (!styleToValidate || !styleToValidate.description.trim()) return;

        setCustomStyles(prev =>
            prev.map(cs =>
                cs.id === id ? { ...cs, isValidating: true, validationError: undefined } : cs
            )
        );

        try {
            const result = await validateAndDescribeStyle(styleToValidate.description);
            setCustomStyles(prev =>
                prev.map(cs =>
                    cs.id === id
                        ? {
                              ...cs,
                              isValidating: false,
                              isValid: result.isValid,
                              generatedDescription: result.description,
                              validationError: result.isValid ? undefined : result.reason,
                          }
                        : cs
                )
            );
        } catch (err) {
            console.error('Validation error:', err);
            setCustomStyles(prev =>
                prev.map(cs =>
                    cs.id === id
                        ? {
                              ...cs,
                              isValidating: false,
                              isValid: false,
                              validationError: 'Could not validate this style. Please try again.',
                          }
                        : cs
                )
            );
        }
    }, [customStyles]);

    const handleTranslate = useCallback(async () => {
        setError(null);
        setTranslations([]);
        setContextAnalysis(null);

        if (!inputText.trim()) {
            setError('Please enter some text to translate.');
            return;
        }

        const unvalidatedCustomStyles = customStyles.some(
            cs => cs.description.trim() !== '' && cs.isValid === null
        );
        if (unvalidatedCustomStyles) {
            setError('Please validate all custom styles before translating.');
            return;
        }

        const stylesToTranslate: { name: string; description: string }[] = [];

        selectedStyles.forEach(selected => {
            const styleInfo = PREDEFINED_STYLES.find(p => p.id === selected.id);
            if (styleInfo) {
                if (selected.variations === 1) {
                    stylesToTranslate.push({ name: styleInfo.name, description: styleInfo.description });
                } else {
                    for (let i = 1; i <= selected.variations; i++) {
                        stylesToTranslate.push({
                            name: `${styleInfo.name} (Variation ${i}/${selected.variations})`,
                            description: styleInfo.description
                        });
                    }
                }
            }
        });
        
        const validCustomStyles = customStyles.filter(cs => cs.isValid);
        validCustomStyles.forEach((custom) => {
            const baseName = `Custom: ${custom.description.substring(0, 25)}${custom.description.length > 25 ? '...' : ''}`;
            if (custom.variations === 1) {
                 stylesToTranslate.push({
                    name: baseName,
                    description: custom.description
                });
            } else {
                 for (let i = 1; i <= custom.variations; i++) {
                    stylesToTranslate.push({
                        name: `${baseName} (Variation ${i}/${custom.variations})`,
                        description: custom.description
                    });
                }
            }
        });
        
        if(stylesToTranslate.length === 0){
            setError('Please select at least one valid translation style.');
            return;
        }

        setIsLoading(true);
        
        try {
            if (contextText.trim()) {
                const analysis = await getContextAnalysis(contextText);
                setContextAnalysis(analysis);
            }

            const results = await translateInStyles(inputText, stylesToTranslate, humanizeLevel, contextText);
            setTranslations(results);
        } catch (err) {
            console.error(err);
            setError('An error occurred during translation. Please check your API key and try again.');
        } finally {
            setIsLoading(false);
        }
    }, [inputText, contextText, selectedStyles, customStyles, humanizeLevel]);
    
    const totalGroups = selectedStyles.length + customStyles.filter(cs => cs.isValid).length;

    const isTranslatingDisabled = isLoading || customStyles.some(cs => cs.isValidating);


    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 font-sans">
            <Header />
            <main className="container mx-auto px-4 py-8 max-w-7xl">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    <div className="flex flex-col gap-6">
                        <div>
                             <label htmlFor="indonesian-text" className="text-lg font-semibold text-teal-300">Indonesian Text</label>
                            <div className="relative mt-2">
                                <textarea
                                    id="indonesian-text"
                                    rows={8}
                                    value={inputText}
                                    onChange={(e) => setInputText(e.target.value)}
                                    placeholder="Ketik atau tempel teks Bahasa Indonesia di sini..."
                                    className="w-full p-4 pr-28 pb-14 bg-gray-800 border-2 border-gray-700 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors duration-200 resize-none"
                                />
                                <button
                                    onClick={handleTranslate}
                                    disabled={isTranslatingDisabled}
                                    className="absolute bottom-4 right-4 bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-6 rounded-lg transition-all duration-200 disabled:bg-gray-600 disabled:cursor-not-allowed transform hover:scale-105"
                                >
                                    {isLoading ? 'Running...' : (customStyles.some(cs => cs.isValidating) ? 'Validating...' : 'RUN')}
                                </button>
                            </div>
                        </div>
                         <div>
                            <label htmlFor="context-text" className="text-lg font-semibold text-teal-300">Tambahkan Konteks (Opsional)</label>
                             <p className="text-xs text-gray-400 mb-2">
                                Jelaskan situasinya agar terjemahan lebih akurat. Contoh: "Untuk presentasi bisnis formal dengan investor."
                            </p>
                            <textarea
                                id="context-text"
                                rows={3}
                                value={contextText}
                                onChange={(e) => setContextText(e.target.value)}
                                placeholder="Jelaskan konteksnya di sini..."
                                className="w-full p-4 bg-gray-800 border-2 border-gray-700 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors duration-200 resize-none"
                            />
                        </div>
                        <HumanizeSlider level={humanizeLevel} setLevel={setHumanizeLevel} />
                    </div>
                    <StyleSelector
                        selectedStyles={selectedStyles}
                        setSelectedStyles={setSelectedStyles}
                        customStyles={customStyles}
                        setCustomStyles={setCustomStyles}
                        onValidateStyle={handleValidateStyle}
                    />
                </div>
                
                {error && <div className="text-center text-red-400 bg-red-900/50 p-4 rounded-lg mb-8">{error}</div>}
                
                {!isLoading && contextAnalysis && <ContextAnalysisCard analysis={contextAnalysis} />}

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {isLoading && Array.from({ length: totalGroups }).map((_, index) => (
                        <div key={index} className="bg-gray-800 p-6 rounded-lg animate-pulse">
                             <div className="h-6 bg-gray-700 rounded w-1/3 mb-4"></div>
                             <div className="h-4 bg-gray-700 rounded w-full mb-2"></div>
                             <div className="h-4 bg-gray-700 rounded w-5/6"></div>
                        </div>
                    ))}
                    {!isLoading && translations.map((result) => (
                        <TranslationCard key={result.baseStyle} baseStyle={result.baseStyle} variations={result.variations} />
                    ))}
                </div>
            </main>
        </div>
    );
};

export default App;