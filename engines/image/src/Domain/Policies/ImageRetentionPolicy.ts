
export class ImageRetentionPolicy {
    private readonly retentionDays: number;
    private readonly maxAgeMs: number;

    constructor(retentionDays: number = 30) {
        this.retentionDays = retentionDays;
        this.maxAgeMs = retentionDays * 24 * 60 * 60 * 1000;
    }

    isExpired(createdAt: number): boolean {
        return Date.now() - createdAt > this.maxAgeMs;
    }

    getRetentionDays(): number {
        return this.retentionDays;
    }
}
