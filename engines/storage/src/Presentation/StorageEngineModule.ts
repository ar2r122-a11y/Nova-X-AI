import { ICoreModule } from "@nova-x-ai/core";
import type { IEventBus, IContainer } from "@nova-x-ai/core";
import type { IStorageEngine } from "../Contracts";
import { IndexedDBAdapter } from "../Infrastructure/Persistence/IndexedDBAdapter";
import { EventStore } from "../Infrastructure/Persistence/EventStore";
import { WALJournal } from "../Infrastructure/Persistence/WALJournal";
import { UnitOfWork } from "../Infrastructure/Persistence/UnitOfWork";
import { RepositoryFactory } from "../Infrastructure/Persistence/RepositoryFactory";
import { SnapshotStore } from "../Infrastructure/Persistence/SnapshotStore";
import { ProjectionStore } from "../Infrastructure/Persistence/ProjectionStore";
import { MigrationRunner } from "../Infrastructure/Persistence/MigrationRunner";
import { DeltaLog } from "../Infrastructure/Persistence/DeltaLog";
import { QuotaGovernor } from "../Infrastructure/Persistence/QuotaGovernor";
import { BackupStore } from "../Infrastructure/Persistence/BackupStore";
import { CompressionEngine } from "../Infrastructure/Persistence/CompressionEngine";
import { DeduplicationEngine } from "../Infrastructure/Persistence/DeduplicationEngine";
import { CacheProvider } from "../Infrastructure/Persistence/CacheProvider";
import { EncryptionBoundary } from "../Infrastructure/Persistence/EncryptionBoundary";
import { RecoveryManager } from "../Infrastructure/Persistence/RecoveryManager";
import { StorageStreamingWorker, SyncWorker, CompactionWorker, CleanupWorker } from "../Infrastructure/Workers";
import type { IStorageWorker } from "../Contracts";

export class StorageEngineModule implements ICoreModule {
    readonly moduleName = "@nova-x-ai/storage";
    private storage: IStorageEngine | null = null;
    private adapter: IndexedDBAdapter | null = null;
    private workers: IStorageWorker[] = [];

    configureServices(_container: IContainer): void {
        this.adapter = new IndexedDBAdapter("nova-x-ai-storage", 1);
    }

    async onInit(): Promise<void> {
        if (!this.adapter) {
            throw new Error("Storage adapter not configured.");
        }

        await this.adapter.open();

        const eventBus = {} as IEventBus;
        const eventStore = new EventStore(this.adapter);
        const wal = new WALJournal(this.adapter);
        const repositoryFactory = new RepositoryFactory(this.adapter);
        const unitOfWork = new UnitOfWork("init", repositoryFactory);
        const snapshotStore = new SnapshotStore(this.adapter);
        const projectionStore = new ProjectionStore(this.adapter);
        const migrationRunner = new MigrationRunner(this.adapter);
        const deltaLog = new DeltaLog(this.adapter);
        const quotaGovernor = new QuotaGovernor();
        const backupStore = new BackupStore(this.adapter);
        const compressionEngine = new CompressionEngine();
        const deduplicationEngine = new DeduplicationEngine();
        const cacheProvider = new CacheProvider(this.adapter);
        const encryptionBoundary = new EncryptionBoundary();
        const recoveryManager = new RecoveryManager();

        const streamingWorker = new StorageStreamingWorker();
        const syncWorker = new SyncWorker();
        const compactionWorker = new CompactionWorker();
        const cleanupWorker = new CleanupWorker();

        this.workers = [streamingWorker, syncWorker, compactionWorker, cleanupWorker];

        const storageImpl = {
            eventBus,
            getRepository: <T>(collection: string) => repositoryFactory.createRepository<T>(collection),
            getUnitOfWork: () => unitOfWork,
            getEventStore: () => eventStore,
            getSnapshotStore: () => snapshotStore,
            getProjectionStore: () => projectionStore,
            getWAL: () => wal,
            getDeltaLog: () => deltaLog,
            getBackupStore: () => backupStore,
            getQuotaPolicy: () => quotaGovernor,
            getCompressionEngine: () => compressionEngine,
            getDeduplicationEngine: () => deduplicationEngine,
            getEncryptionBoundary: () => encryptionBoundary,
            getCacheProvider: () => cacheProvider,
            getMigrationRunner: () => migrationRunner,
            getQuotaUsage: async () => {
                const adapter = this.adapter;
                if (!adapter) {
                    return { totalBytes: 0, eventStoreBytes: 0, snapshotBytes: 0, backupBytes: 0, limitBytes: 1073741824, lastUpdated: Date.now() };
                }

                const eventStoreBytes = await this.countStore(adapter, "events");
                const snapshotBytes = await this.countStore(adapter, "snapshots");
                const backupBytes = await this.countStore(adapter, "backups");
                const walBytes = await this.countStore(adapter, "wal");
                const totalBytes = eventStoreBytes + snapshotBytes + backupBytes + walBytes;

                return { totalBytes, eventStoreBytes, snapshotBytes, backupBytes, limitBytes: 1073741824, lastUpdated: Date.now() };
            },
            interrupt: async () => {
                for (const worker of this.workers) {
                    await worker.stop();
                }
            },
            recover: async () => {
                await recoveryManager.recover(this.storage!);
            }
        };

        this.storage = storageImpl as unknown as IStorageEngine;

        compactionWorker.setStorage(this.storage);
        cleanupWorker.setStorage(this.storage);
        syncWorker.setStorage(this.storage);

        for (const worker of this.workers) {
            await worker.start();
        }
    }

    async onDestroy(): Promise<void> {
        for (const worker of this.workers) {
            await worker.stop();
        }
        if (this.adapter) {
            await this.adapter.close();
        }
    }

    getStorage(): IStorageEngine | null {
        return this.storage;
    }

    private async countStore(adapter: IndexedDBAdapter, storeName: string): Promise<number> {
        const tx = adapter.transaction([storeName], "readonly");
        const store = tx.objectStore(storeName);

        return new Promise((resolve, reject) => {
            const request = store.count();
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }
}
