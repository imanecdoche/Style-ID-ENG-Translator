export interface TranslationStyle {
  id: string;
  name: string;
  description: string;
}

export interface SingleTranslationResult {
  style: string;
  translation: string;
}

export interface TranslationResultGroup {
  baseStyle: string;
  variations: string[];
}

export interface SelectedStyleConfig {
  id: string;
  variations: number;
}

export interface CustomStyle {
  id: string;
  description: string;
  variations: number;
  isValidating: boolean;
  isValid: boolean | null;
  generatedDescription?: string;
  validationError?: string;
}
