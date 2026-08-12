
export class IsWithinRetentionPeriodSpecification {
    public isSatisfiedBy(createdAt: number, retentionDays: number): boolean {
        const maxAgeMs = retentionDays * 24 * 60 * 60 * 1000;
        return Date.now() - createdAt <= maxAgeMs;
    }
}
