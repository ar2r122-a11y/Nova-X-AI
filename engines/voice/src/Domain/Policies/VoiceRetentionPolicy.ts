export class VoiceRetentionPolicy {
    static readonly MAX_SESSION_AGE_MS = 7 * 24 * 60 * 60 * 1000;
    static readonly MAX_AUDIO_CACHE_AGE_MS = 24 * 60 * 60 * 1000;
    static readonly MAX_COMPLETED_SESSIONS = 1000;

    static isSessionExpired(startedAt: number): boolean {
        return Date.now() - startedAt > VoiceRetentionPolicy.MAX_SESSION_AGE_MS;
    }

    static isAudioCacheExpired(cachedAt: number): boolean {
        return Date.now() - cachedAt > VoiceRetentionPolicy.MAX_AUDIO_CACHE_AGE_MS;
    }
}
