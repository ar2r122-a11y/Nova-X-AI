export class VoiceRateLimitPolicy {
    static readonly MAX_REQUESTS_PER_MINUTE = 20;
    private readonly requestTimestamps: number[] = [];

    static canProceed(history: number[]): boolean {
        const oneMinuteAgo = Date.now() - 60000;
        const recentRequests = history.filter(ts => ts > oneMinuteAgo);
        return recentRequests.length < VoiceRateLimitPolicy.MAX_REQUESTS_PER_MINUTE;
    }

    recordRequest(history: number[]): number[] {
        const now = Date.now();
        const updated = [...history, now];
        const oneMinuteAgo = now - 60000;
        return updated.filter(ts => ts > oneMinuteAgo);
    }

    getRemainingRequests(history: number[]): number {
        const oneMinuteAgo = Date.now() - 60000;
        const recentRequests = history.filter(ts => ts > oneMinuteAgo);
        return Math.max(0, VoiceRateLimitPolicy.MAX_REQUESTS_PER_MINUTE - recentRequests.length);
    }
}
