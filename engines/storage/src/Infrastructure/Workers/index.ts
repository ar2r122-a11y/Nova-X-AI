import type { IStorageWorker, IStorageEngine } from "../../Contracts";

export class StorageStreamingWorker implements IStorageWorker {
    private running = false;

    async start(): Promise<void> {
        this.running = true;
        this.processQueue();
    }

    async stop(): Promise<void> {
        this.running = false;
    }

    isRunning(): boolean {
        return this.running;
    }

    getWorkerName(): string {
        return "StorageStreamingWorker";
    }

    private async processQueue(): Promise<void> {
        while (this.running) {
            await new Promise(resolve => setTimeout(resolve, 100));
        }
    }
}

export class SyncWorker implements IStorageWorker {
    private running = false;

    async start(): Promise<void> {
        this.running = true;
        this.sync();
    }

    async stop(): Promise<void> {
        this.running = false;
    }

    isRunning(): boolean {
        return this.running;
    }

    getWorkerName(): string {
        return "SyncWorker";
    }

    private async sync(): Promise<void> {
        while (this.running) {
            await new Promise(resolve => setTimeout(resolve, 5000));
        }
    }
}

export class CompactionWorker implements IStorageWorker {
    private running = false;
    private storage: IStorageEngine | null = null;

    setStorage(storage: IStorageEngine): void {
        this.storage = storage;
    }

    async start(): Promise<void> {
        if (!this.storage) {
            throw new Error("Storage not set for CompactionWorker");
        }
        this.running = true;
        this.compact();
    }

    async stop(): Promise<void> {
        this.running = false;
    }

    isRunning(): boolean {
        return this.running;
    }

    getWorkerName(): string {
        return "CompactionWorker";
    }

    private async compact(): Promise<void> {
        while (this.running) {
            if (!this.storage) break;
            const snapshotStore = this.storage.getSnapshotStore();
            const snapshots = await snapshotStore.getAllSnapshots();
            for (const snapshot of snapshots) {
                await snapshotStore.compact(snapshot.streamId, 86400000);
            }
            await new Promise(resolve => setTimeout(resolve, 60000));
        }
    }
}

export class CleanupWorker implements IStorageWorker {
    private running = false;
    private storage: IStorageEngine | null = null;

    setStorage(storage: IStorageEngine): void {
        this.storage = storage;
    }

    async start(): Promise<void> {
        if (!this.storage) {
            throw new Error("Storage not set for CleanupWorker");
        }
        this.running = true;
        this.cleanup();
    }

    async stop(): Promise<void> {
        this.running = false;
    }

    isRunning(): boolean {
        return this.running;
    }

    getWorkerName(): string {
        return "CleanupWorker";
    }

    private async cleanup(): Promise<void> {
        while (this.running) {
            if (!this.storage) break;
            const dedup = this.storage.getDeduplicationEngine();
            await dedup.prune(86400000);
            await new Promise(resolve => setTimeout(resolve, 300000));
        }
    }
}
