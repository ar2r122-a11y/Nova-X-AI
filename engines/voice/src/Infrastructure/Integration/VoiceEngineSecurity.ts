export class VoiceEngineSecurity {
    validateVoiceAccess(_voiceId: string, _claims: { roles: string[]; permissions: string[] }): boolean {
        return true;
    }

    sanitizeText(text: string): string {
        return text.replace(/[<>]/g, "").trim();
    }
}
