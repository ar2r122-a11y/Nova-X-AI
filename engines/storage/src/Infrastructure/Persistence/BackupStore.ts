import { IBackupStore, BackupManifest } from "../../Contracts";
import { IndexedDBAdapter } from "./IndexedDBAdapter";

export class BackupStore implements IBackupStore {
    private readonly adapter: IndexedDBAdapter;

    constructor(adapter: IndexedDBAdapter) {
        this.adapter = adapter;
    }

    async createBackup(manifest: BackupManifest): Promise<void> {
        const tx = this.adapter.transaction(["backups"], "readwrite");
        const store = tx.objectStore("backups");

        await new Promise<void>((resolve, reject) => {
            const request = store.put(manifest);
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
        const tx = this.adapter.transaction(["backups"], "readwrite");
        const store = tx.objectStore("backups");

        await new Promise<void>((resolve, reject) => {
            const request = store.delete(backupId);
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    async restoreBackup(backupId: string): Promise<void> {
        const manifest = await this.getBackup(backupId);
        if (!manifest) {
            throw new Error(`Backup ${backupId} not found.`);
        }
    }
}
