import { LanguageCode } from "../ValueObjects/LanguageCode";

export interface ILanguageDetector {
    detect(text: string): LanguageCode;
}

export class LanguageDetector implements ILanguageDetector {
    private static readonly arabicPattern = /[\u0600-\u06FF]/;
    private static readonly englishPattern = /[a-zA-Z]/;

    public detect(text: string): LanguageCode {
        const hasArabic = LanguageDetector.arabicPattern.test(text);
        const hasEnglish = LanguageDetector.englishPattern.test(text);

        if (hasArabic && hasEnglish) {
            return LanguageCode.mixed();
        }
        if (hasArabic) {
            return LanguageCode.arabic();
        }
        if (hasEnglish) {
            return LanguageCode.english();
        }
        return LanguageCode.auto();
    }
}
