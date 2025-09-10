import { GoogleGenAI, Type } from "@google/genai";
import type { TranslationResultGroup, SingleTranslationResult } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const translationResponseSchema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        style: {
          type: Type.STRING,
          description: 'The name of the style requested.',
        },
        translation: {
          type: Type.STRING,
          description: 'The translated text in the specified style.',
        },
      },
      required: ["style", "translation"],
    },
};

const validationResponseSchema = {
    type: Type.OBJECT,
    properties: {
        isValid: { 
            type: Type.BOOLEAN,
            description: 'Whether the style is coherent and actionable.' 
        },
        reason: { 
            type: Type.STRING,
            description: 'If not valid, a brief explanation why. Empty if valid.'
        },
        description: { 
            type: Type.STRING,
            description: 'If valid, a brief description of the style. Empty if not valid.'
        },
    },
    required: ["isValid", "reason", "description"],
}

export const getContextAnalysis = async (context: string): Promise<string> => {
    const prompt = `Anda adalah asisten AI. Analisis konteks berikut yang diberikan oleh pengguna untuk tugas terjemahan. Tanggapi HANYA dalam Bahasa Indonesia dengan paragraf singkat (2-3 kalimat) yang menjelaskan pemahaman Anda tentang konteks tersebut dan bagaimana hal itu akan memengaruhi terjemahan. Bersikaplah membantu dan konfirmasikan pemahaman Anda.

Konteks Pengguna: "${context}"`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        console.error("Error calling Gemini API for context analysis:", error);
        throw new Error("Failed to get context analysis from Gemini API.");
    }
};


export const validateAndDescribeStyle = async (
    stylePrompt: string
): Promise<{ isValid: boolean; reason: string; description: string; }> => {
    const prompt = `You are a style validator. Analyze the following user-provided style description for a text translation task. Determine if it's a coherent, recognizable, and actionable style. Fictional, historical, pop-culture, professional, and creative styles are all valid as long as they are understandable. Vague or nonsensical styles are invalid.

User style: "${stylePrompt}"

If the style is valid, set 'isValid' to true, provide a brief, one-sentence description of what this style entails for a translator, and set 'reason' to an empty string.
If the style is invalid, set 'isValid' to false, explain why in the 'reason' field (e.g., 'This style is too vague to be actionable'), and set 'description' to an empty string.

Respond ONLY with a single JSON object that adheres strictly to the provided schema.`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
              responseMimeType: "application/json",
              responseSchema: validationResponseSchema,
            },
        });
        const jsonString = response.text.trim();
        return JSON.parse(jsonString);
    } catch (error) {
        console.error("Error calling Gemini API for validation:", error);
        throw new Error("Failed to validate style from Gemini API.");
    }
}

export const translateInStyles = async (
    text: string, 
    styles: { name: string; description: string }[],
    humanizeLevel: number,
    contextText: string,
): Promise<TranslationResultGroup[]> => {
    const styleDescriptions = styles.map(style => `- ${style.name}: ${style.description}`).join('\n');

    let humanizeInstruction = '';
    if (humanizeLevel > 0) {
        let intensity = 'subtle';
        if (humanizeLevel > 25) intensity = 'moderate';
        if (humanizeLevel > 50) intensity = 'heavy';
        if (humanizeLevel > 75) intensity = 'extreme';

        humanizeInstruction = `\nIMPORTANT POST-PROCESSING STEP: After translating, apply a "${intensity}" level of humanization to each translation. This means making the text appear as if it were typed by a real person in a casual setting. This may include using mostly lowercase letters, simplified or sometimes omitted punctuation, and common informal abbreviations (like 'u' for 'you', 'lol', 'btw'). The level of intensity is crucial; '${intensity}' should guide the final output.`;
    }

    const contextInstruction = contextText.trim()
        ? `\nCRITICAL CONTEXT: The user has provided the following context for the translation. You MUST adhere to this context to ensure the translation is accurate and appropriate.\nContext: "${contextText.trim()}"`
        : '';

    const prompt = `You are an expert multilingual translator specializing in stylistic and nuanced translations. Your task is to translate the following Indonesian text into English. You must provide multiple translations, one for each of the specified target styles.
${contextInstruction}
Indonesian Text:
"${text}"
${humanizeInstruction}
Translate the text above into the following styles. Ensure the 'style' key in your JSON response for each object exactly matches the style name provided here (e.g., "Formal British (Variation 1/2)").
${styleDescriptions}

Return your response ONLY as a JSON array of objects, adhering strictly to the provided schema. Each object in the array must contain two keys: "style" (the name of the style as provided above) and "translation" (the translated text in that style). Do not include any other text, explanations, or formatting outside of the JSON array.`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
              responseMimeType: "application/json",
              responseSchema: translationResponseSchema,
            },
        });

        const jsonString = response.text.trim();
        const parsedResult = JSON.parse(jsonString) as SingleTranslationResult[];

        if (!Array.isArray(parsedResult)) {
            throw new Error("API did not return a valid array.");
        }
        
        // Group variations
        const groupedResults = new Map<string, string[]>();
        const originalOrder: string[] = [];

        styles.forEach(styleRequest => {
            const baseStyle = styleRequest.name.replace(/\s\(Variation.*\)$/, '');
            if (!groupedResults.has(baseStyle)) {
                groupedResults.set(baseStyle, []);
                originalOrder.push(baseStyle);
            }
        });

        parsedResult.forEach(res => {
            const baseStyle = res.style.replace(/\s\(Variation.*\)$/, '');
            const group = groupedResults.get(baseStyle);
            if(group) {
                group.push(res.translation);
            } else {
                // Handle cases where API returns a style that wasn't perfectly matched
                groupedResults.set(baseStyle, [res.translation]);
                if(!originalOrder.includes(baseStyle)) {
                    originalOrder.push(baseStyle)
                }
            }
        });

        return originalOrder.map(baseStyle => ({
            baseStyle,
            variations: groupedResults.get(baseStyle) || [],
        })).filter(g => g.variations.length > 0);

    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw new Error("Failed to get translation from Gemini API.");
    }
};