export class VoiceSafetyPolicy {
    static sanitizeText(text: string): string {
        const sanitized = text.replace(/[<>]/g, "").trim();
        if (sanitized.length === 0) {
            throw new Error("Sanitized text is empty.");
        }
        return sanitized;
    }

    static isRestrictedVoiceProfile(profile: { voiceId: string; supportedParameters: string[] }): boolean {
        const restrictedPatterns = ["biometric", "cloning", "impersonation"];
        return restrictedPatterns.some(pattern => profile.voiceId.toLowerCase().includes(pattern));
    }
}
