export class SynthesisQuotaPolicy {
    static readonly MAX_INPUT_CHARACTERS = 2048;
    static readonly MAX_DAILY_SYNTHESIS_REQUESTS = 1000;
    static readonly MAX_MONTHLY_AUDIO_DURATION_MS = 3600000;

    static validateInputLength(text: string): void {
        if (text.length > SynthesisQuotaPolicy.MAX_INPUT_CHARACTERS) {
            throw new Error(`Input text exceeds maximum length of ${SynthesisQuotaPolicy.MAX_INPUT_CHARACTERS} characters.`);
        }
    }

    static canSynthesize(dailyCount: number, monthlyDurationMs: number, estimatedDurationMs: number): boolean {
        if (dailyCount >= SynthesisQuotaPolicy.MAX_DAILY_SYNTHESIS_REQUESTS) {
            return false;
        }
        if (monthlyDurationMs + estimatedDurationMs > SynthesisQuotaPolicy.MAX_MONTHLY_AUDIO_DURATION_MS) {
            return false;
        }
        return true;
    }
}
