import { IProjectionStore } from "../../Contracts";
import { IndexedDBAdapter } from "./IndexedDBAdapter";

export class ProjectionStore implements IProjectionStore {
    private readonly adapter: IndexedDBAdapter;

    constructor(adapter: IndexedDBAdapter) {
        this.adapter = adapter;
    }

    async saveProjection(name: string, data: unknown): Promise<void> {
        const tx = this.adapter.transaction(["projections"], "readwrite");
        const store = tx.objectStore("projections");

        await new Promise<void>((resolve, reject) => {
            const request = store.put({ name, data, updatedAt: Date.now() });
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    async getProjection(name: string): Promise<unknown> {
        const tx = this.adapter.transaction(["projections"], "readonly");
        const store = tx.objectStore("projections");

        return new Promise((resolve, reject) => {
            const request = store.get(name);
            request.onsuccess = () => resolve(request.result?.data ?? null);
            request.onerror = () => reject(request.error);
        });
    }

    async deleteProjection(name: string): Promise<void> {
        const tx = this.adapter.transaction(["projections"], "readwrite");
        const store = tx.objectStore("projections");

        await new Promise<void>((resolve, reject) => {
            const request = store.delete(name);
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    async listProjections(): Promise<string[]> {
        const tx = this.adapter.transaction(["projections"], "readonly");
        const store = tx.objectStore("projections");

        return new Promise((resolve, reject) => {
            const request = store.getAllKeys();
            request.onsuccess = () => resolve(request.result as string[]);
            request.onerror = () => reject(request.error);
        });
    }

    async resetProjection(name: string): Promise<void> {
        await this.saveProjection(name, null);
    }
}
