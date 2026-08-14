import { IBackupStore, BackupManifest } from "../../Contracts";
import { IndexedDBAdapter } from "./IndexedDBAdapter";

const STORE_NAMES = [
    "events",
    "snapshots",
    "wal",
    "migrations",
    "backups",
    "vectorClocks",
    "projections",
    "deltaLog",
    "repositories",
    "cache"
];

export class BackupStore implements IBackupStore {
    private readonly adapter: IndexedDBAdapter;

    constructor(adapter: IndexedDBAdapter) {
        this.adapter = adapter;
    }

    async createBackup(manifest: BackupManifest): Promise<void> {
        const tx = this.adapter.transaction(["backups", "backupData"], "readwrite");
        const backupStore = tx.objectStore("backups");
        const dataStore = tx.objectStore("backupData");

        const snapshot: Record<string, unknown[]> = {};
        for (const name of STORE_NAMES) {
            try {
                const records = await this.readAll(name);
                snapshot[name] = records;
            } catch {
                snapshot[name] = [];
            }
        }

        await new Promise<void>((resolve, reject) => {
            const request = backupStore.put(manifest);
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });

        await new Promise<void>((resolve, reject) => {
            const request = dataStore.put({ backupId: manifest.backupId, snapshot, restoredAt: null as number | null });
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    async getBackup(backupId: string): Promise<BackupManifest | null> {
        const tx = this.adapter.transaction(["backups"], "readonly");
        const store = tx.objectStore("backups");

        return new Promise((resolve, reject) => {
            const request = store.get(backupId);
            request.onsuccess = () => resolve(request.result ?? null);
            request.onerror = () => reject(request.error);
        });
    }

    async listBackups(): Promise<BackupManifest[]> {
        const tx = this.adapter.transaction(["backups"], "readonly");
        const store = tx.objectStore("backups");

        return new Promise((resolve, reject) => {
            const request = store.getAll();
            request.onsuccess = () => resolve(request.result as BackupManifest[]);
            request.onerror = () => reject(request.error);
        });
    }

    async deleteBackup(backupId: string): Promise<void> {
        const tx = this.adapter.transaction(["backups", "backupData"], "readwrite");
        const backupStore = tx.objectStore("backups");
        const dataStore = tx.objectStore("backupData");

        await new Promise<void>((resolve, reject) => {
            const request = backupStore.delete(backupId);
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });

        await new Promise<void>((resolve, reject) => {
            const request = dataStore.delete(backupId);
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    async restoreBackup(backupId: string): Promise<void> {
        const manifest = await this.getBackup(backupId);
        if (!manifest) {
            throw new Error(`Backup ${backupId} not found.`);
        }

        const tx = this.adapter.transaction(["backupData"], "readonly");
        const dataStore = tx.objectStore("backupData");

        const backupData = await new Promise<{ backupId: string; snapshot: Record<string, unknown[]>; restoredAt: number | null } | undefined>((resolve, reject) => {
            const request = dataStore.get(backupId);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });

        if (!backupData || !backupData.snapshot) {
            throw new Error(`Backup data for ${backupId} not found.`);
        }

        for (const name of STORE_NAMES) {
            await this.clearStore(name);
            const records = backupData.snapshot[name] ?? [];
            for (const record of records) {
                await this.writeRecord(name, record);
            }
        }
    }

    private async readAll(storeName: string): Promise<unknown[]> {
        const tx = this.adapter.transaction([storeName], "readonly");
        const store = tx.objectStore(storeName);

        return new Promise((resolve, reject) => {
            const request = store.getAll();
            request.onsuccess = () => resolve(request.result as unknown[]);
            request.onerror = () => reject(request.error);
        });
    }

    private async clearStore(storeName: string): Promise<void> {
        const tx = this.adapter.transaction([storeName], "readwrite");
        const store = tx.objectStore(storeName);

        await new Promise<void>((resolve, reject) => {
            const request = store.clear();
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    private async writeRecord(storeName: string, record: unknown): Promise<void> {
        const tx = this.adapter.transaction([storeName], "readwrite");
        const store = tx.objectStore(storeName);

        await new Promise<void>((resolve, reject) => {
            const request = store.put(record);
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }
}
