export class IndexedDBAdapter {
    private dbName: string;
    private version: number;
    private db: IDBDatabase | null = null;

    constructor(dbName: string, version: number = 1) {
        this.dbName = dbName;
        this.version = version;
    }

    public async open(): Promise<IDBDatabase> {
        if (this.db) return this.db;

        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.version);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => {
                this.db = request.result;
                resolve(this.db);
            };

            request.onupgradeneeded = (event) => {
                const db = (event.target as IDBOpenDBRequest).result;
                this.createObjectStores(db);
            };
        });
    }

    private createObjectStores(db: IDBDatabase): void {
        if (!db.objectStoreNames.contains("events")) {
            db.createObjectStore("events", { keyPath: "eventId" });
        }
        if (!db.objectStoreNames.contains("snapshots")) {
            db.createObjectStore("snapshots", { keyPath: "snapshotId" });
        }
        if (!db.objectStoreNames.contains("wal")) {
            const store = db.createObjectStore("wal", { keyPath: "index", autoIncrement: true });
            store.createIndex("timestamp", "timestamp");
        }
        if (!db.objectStoreNames.contains("migrations")) {
            db.createObjectStore("migrations", { keyPath: "migrationId" });
        }
        if (!db.objectStoreNames.contains("backups")) {
            db.createObjectStore("backups", { keyPath: "backupId" });
        }
        if (!db.objectStoreNames.contains("backupData")) {
            db.createObjectStore("backupData", { keyPath: "backupId" });
        }
        if (!db.objectStoreNames.contains("vectorClocks")) {
            db.createObjectStore("vectorClocks", { keyPath: "streamId" });
        }
        if (!db.objectStoreNames.contains("projections")) {
            db.createObjectStore("projections", { keyPath: "name" });
        }
        if (!db.objectStoreNames.contains("deltaLog")) {
            const store = db.createObjectStore("deltaLog", { keyPath: "id", autoIncrement: true });
            store.createIndex("streamId", "streamId");
        }
        if (!db.objectStoreNames.contains("repositories")) {
            db.createObjectStore("repositories", { keyPath: "key" });
        }
        if (!db.objectStoreNames.contains("cache")) {
            const store = db.createObjectStore("cache", { keyPath: "key" });
            store.createIndex("expiresAt", "expiresAt");
        }
    }

    public transaction(storeNames: string[], mode: IDBTransactionMode = "readonly"): IDBTransaction {
        if (!this.db) {
            throw new Error("Database not initialized. Call open() first.");
        }
        return this.db.transaction(storeNames, mode);
    }

    public async close(): Promise<void> {
        if (this.db) {
            this.db.close();
            this.db = null;
        }
    }
}
