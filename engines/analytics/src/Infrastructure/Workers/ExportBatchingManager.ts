export class ExportBatchingManager {
    private batch: unknown[] = [];
    private readonly maxBatchSize: number;

    constructor(maxBatchSize: number = 100) {
        this.maxBatchSize = maxBatchSize;
    }

    add(item: unknown): void {
        this.batch.push(item);
    }

    getBatch(): unknown[] {
        const batch = [...this.batch];
        this.batch = [];
        return batch;
    }

    isFull(): boolean {
        return this.batch.length >= this.maxBatchSize;
    }
}
