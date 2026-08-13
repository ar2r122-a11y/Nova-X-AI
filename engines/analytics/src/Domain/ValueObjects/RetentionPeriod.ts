export class RetentionPeriod {
    private readonly rawRetentionMs: number;
    private readonly summaryRetentionMs: number;

    private constructor(rawRetentionMs: number, summaryRetentionMs: number) {
        this.rawRetentionMs = rawRetentionMs;
        this.summaryRetentionMs = summaryRetentionMs;
    }

    static create(rawDays: number, summaryDays: number): RetentionPeriod {
        return new RetentionPeriod(rawDays * 24 * 60 * 60 * 1000, summaryDays * 24 * 60 * 60 * 1000);
    }

    getRawRetentionMs(): number {
        return this.rawRetentionMs;
    }

    getSummaryRetentionMs(): number {
        return this.summaryRetentionMs;
    }

    isExpired(timestamp: number, type: "raw" | "summary"): boolean {
        const retention = type === "raw" ? this.rawRetentionMs : this.summaryRetentionMs;
        return Date.now() - timestamp > retention;
    }
}
