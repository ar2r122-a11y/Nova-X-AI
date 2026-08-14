import type { IEventBus, IDomainEvent, IEventHandler } from "@nova-x-ai/core";
import type { IRepository, IStorageEngine, QuotaUsage } from "@nova-x-ai/storage";

class InMemoryRepository<T> implements IRepository<T> {
    private store: Map<string, T> = new Map();

    async getById(key: string): Promise<T | null> {
        return this.store.get(key) ?? null;
    }

    async getAll(): Promise<T[]> {
        return Array.from(this.store.values());
    }

    async save(entity: T): Promise<void> {
        const id = (entity as { id?: string }).id;
        if (id) {
            this.store.set(id, entity);
        }
    }

    async delete(key: string): Promise<void> {
        this.store.delete(key);
    }

    async exists(key: string): Promise<boolean> {
        return this.store.has(key);
    }
}

class SimpleEventBus implements IEventBus {
    private handlers: Map<string, Set<IEventHandler<any>>> = new Map();

    async publish<T extends IDomainEvent>(event: T): Promise<void> {
        const handlers = this.handlers.get(event.eventType);
        if (handlers) {
            for (const handler of handlers) {
                await handler.handle(event);
            }
        }
    }

    subscribe<T extends IDomainEvent>(eventType: string, handler: IEventHandler<T>): void {
        const handlers = this.handlers.get(eventType);
        if (handlers) {
            handlers.add(handler as IEventHandler<any>);
        } else {
            this.handlers.set(eventType, new Set([handler as IEventHandler<any>]));
        }
    }
}

export class BrowserStorageEngine implements IStorageEngine {
    readonly eventBus: IEventBus;
    private readonly repositories: Map<string, IRepository<any>> = new Map();

    constructor() {
        this.eventBus = new SimpleEventBus();
        this.loadFromStorage();
    }

    getRepository<T>(collection: string): IRepository<T> {
        let repo = this.repositories.get(collection);
        if (!repo) {
            repo = new InMemoryRepository<T>();
            this.repositories.set(collection, repo as IRepository<any>);
        }
        return repo;
    }

    getUnitOfWork() {
        return {
            getRepository: <T>(collection: string) => this.getRepository<T>(collection),
            commit: async () => this.persistToStorage(),
            rollback: async () => this.loadFromStorage(),
            isActive: () => false,
            transactionId: "browser-uow-" + Date.now()
        };
    }

    getEventStore() {
        return {
            appendToStream: async () => {},
            readStream: async () => [],
            readAllStreams: async () => [],
            getStreamVersion: async () => 0,
            subscribeToStream: () => () => {}
        };
    }

    getSnapshotStore() {
        return {
            saveSnapshot: async () => {},
            getSnapshot: async () => null,
            deleteSnapshot: async () => {},
            getAllSnapshots: async () => [],
            compact: async () => 0
        };
    }

    getProjectionStore() {
        return {
            saveProjection: async () => {},
            getProjection: async () => null,
            deleteProjection: async () => {},
            listProjections: async () => [],
            resetProjection: async () => {}
        };
    }

    getWAL() {
        return {
            append: async () => {},
            readEntries: async () => [],
            truncate: async () => {},
            clear: async () => {},
            getCount: async () => 0
        };
    }

    getDeltaLog() {
        return {
            recordDelta: async () => {},
            getDeltas: async () => [],
            resolveConflicts: async () => null,
            clear: async () => {},
            getAllStreams: async () => []
        };
    }

    getBackupStore() {
        return {
            createBackup: async () => {},
            getBackup: async () => null,
            listBackups: async () => [],
            deleteBackup: async () => {},
            restoreBackup: async () => {}
        };
    }

    getQuotaPolicy() {
        return {
            checkQuota: () => ({ allowed: true }),
            calculateUsage: (_current: any, _addition: any) => _current,
            getEvictionCandidates: async () => []
        };
    }

    getCompressionEngine() {
        return {
            compress: async (data: ArrayBuffer) => ({ data, algorithm: "none" }),
            decompress: async (data: ArrayBuffer) => data,
            estimateCompressionRatio: async () => 1
        };
    }

    getDeduplicationEngine() {
        return {
            computeFingerprint: async () => "",
            isDuplicate: async () => false,
            recordFingerprint: async () => {},
            prune: async () => 0
        };
    }

    getEncryptionBoundary() {
        return {
            encrypt: async (data: ArrayBuffer) => ({ data, keyId: "none" }),
            decrypt: async (data: ArrayBuffer) => data,
            rotateKey: async () => {}
        };
    }

    getCacheProvider() {
        return {
            get: async () => null,
            set: async () => {},
            delete: async () => {},
            clear: async () => {},
            getKeys: async () => []
        };
    }

    getMigrationRunner() {
        return {
            getPendingMigrations: async () => [],
            getAppliedMigrations: async () => [],
            applyMigration: async () => {},
            rollbackMigration: async () => {},
            getCurrentSchemaVersion: async () => "1.0.0"
        };
    }

    async getQuotaUsage(): Promise<QuotaUsage> {
        return {
            totalBytes: 1024 * 1024 * 1024,
            eventStoreBytes: 0,
            snapshotBytes: 0,
            backupBytes: 0,
            limitBytes: 1024 * 1024 * 1024,
            lastUpdated: Date.now()
        };
    }

    async interrupt(): Promise<void> {}
    async recover(): Promise<void> {}

    private async persistToStorage(): Promise<void> {
        const data: Record<string, any[]> = {};
        for (const [name, repo] of this.repositories.entries()) {
            data[name] = await repo.getAll();
        }
        try {
            localStorage.setItem("nova-storage", JSON.stringify(data));
        } catch {
            // Storage full or unavailable
        }
    }

    private loadFromStorage(): void {
        try {
            const raw = localStorage.getItem("nova-storage");
            if (!raw) return;
            const data = JSON.parse(raw);
            for (const [name, entities] of Object.entries(data)) {
                const repo = new InMemoryRepository<any>();
                for (const entity of (entities as any[])) {
                    if (entity.id) {
                        repo.save(entity);
                    }
                }
                this.repositories.set(name, repo);
            }
        } catch {
            // Corrupted storage
        }
    }
}

export function createBrowserStorageEngine(): IStorageEngine {
    return new BrowserStorageEngine();
}
