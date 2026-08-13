export class RetentionPolicy {
    static validateRetention(rawDays: number, summaryDays: number): void {
        if (rawDays <= 0 || summaryDays <= 0) {
            throw new Error("Retention periods must be positive.");
        }
        if (summaryDays < rawDays) {
            throw new Error("Summary retention must be greater than or equal to raw retention.");
        }
    }
}
