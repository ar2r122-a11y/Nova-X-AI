export class StreamingPolicy {
    private readonly maxConcurrentStreams: number;
    private activeStreams: number = 0;
    private readonly uiPaintBudgetMs: number;

    public constructor(maxConcurrentStreams: number = 4, uiPaintBudgetMs: number = 10) {
        this.maxConcurrentStreams = maxConcurrentStreams;
        this.uiPaintBudgetMs = uiPaintBudgetMs;
    }

    public canStartStream(): boolean {
        return this.activeStreams < this.maxConcurrentStreams;
    }

    public startStream(): void {
        if (!this.canStartStream()) {
            throw new Error("Maximum concurrent streams reached.");
        }
        this.activeStreams += 1;
    }

    public endStream(): void {
        if (this.activeStreams > 0) {
            this.activeStreams -= 1;
        }
    }

    public getUIPaintBudgetMs(): number {
        return this.uiPaintBudgetMs;
    }
}
