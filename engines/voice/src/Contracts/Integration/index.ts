export interface IVoiceEngineOpenApi {
    getVoiceEngine(): import("../IVoiceEngine").IVoiceEngine | null;
    getRuntime(): import("../Runtime/IVoiceRuntime").IVoiceRuntime | null;
}

export interface IVoiceEngineSecurity {
    validateVoiceAccess(voiceId: string, claims: { roles: string[]; permissions: string[] }): boolean;
    sanitizeText(text: string): string;
}

export interface IVoiceEngineAclTranslator {
    translateVoiceProfileToAcl(profile: import("../../Domain/Entities/VoiceProfile").VoiceProfile): Record<string, unknown>;
}
