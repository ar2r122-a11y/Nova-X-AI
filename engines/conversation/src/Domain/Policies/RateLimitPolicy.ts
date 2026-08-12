export class RateLimitPolicy {
    private readonly maxTurnsPerMinute: number;
    private readonly turnTimestamps: number[] = [];

    public constructor(maxTurnsPerMinute: number = 30) {
        this.maxTurnsPerMinute = maxTurnsPerMinute;
    }

    public canProceed(): boolean {
        const now = Date.now();
        const oneMinuteAgo = now - 60_000;
        while (this.turnTimestamps.length > 0 && this.turnTimestamps[0] < oneMinuteAgo) {
            this.turnTimestamps.shift();
        }
        return this.turnTimestamps.length <= this.maxTurnsPerMinute;
    }

    public recordTurn(): void {
        this.turnTimestamps.push(Date.now());
    }
}
