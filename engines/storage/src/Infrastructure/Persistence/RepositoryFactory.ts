import { IRepository, IRepositoryFactory } from "../../Contracts";
import { IndexedDBAdapter } from "./IndexedDBAdapter";

export class RepositoryRegistry {
    private readonly repositories = new Map<string, IRepository<any>>();

    register<T>(collection: string, repository: IRepository<T>): void {
        this.repositories.set(collection, repository);
    }

    get<T>(collection: string): IRepository<T> | undefined {
        return this.repositories.get(collection);
    }

    has(collection: string): boolean {
        return this.repositories.has(collection);
    }

    clear(): void {
        this.repositories.clear();
    }
}

export class RepositoryFactory implements IRepositoryFactory {
    private readonly registry = new RepositoryRegistry();
    private readonly adapter: IndexedDBAdapter;

    constructor(adapter: IndexedDBAdapter) {
        this.adapter = adapter;
    }

    createRepository<T>(collection: string): IRepository<T> {
        if (this.registry.has(collection)) {
            return this.registry.get(collection)!;
        }

        const repo = new IndexedDBRepository(this.adapter, collection);
        this.registry.register(collection, repo);
        return repo;
    }

    registerRepository<T>(collection: string, repository: IRepository<T>): void {
        this.registry.register(collection, repository);
    }

    getRepository<T>(collection: string): IRepository<T> | undefined {
        return this.registry.get(collection);
    }
}

class IndexedDBRepository implements IRepository<any> {
    constructor(private readonly adapter: IndexedDBAdapter, private readonly collection: string) {}

    async getById(key: string): Promise<any | null> {
        const tx = this.adapter.transaction(["repositories"], "readonly");
        const store = tx.objectStore("repositories");

        return new Promise((resolve, reject) => {
            const request = store.get(key);
            request.onsuccess = () => resolve(request.result?.value ?? null);
            request.onerror = () => reject(request.error);
        });
    }

    async getAll(): Promise<any[]> {
        const tx = this.adapter.transaction(["repositories"], "readonly");
        const store = tx.objectStore("repositories");

        return new Promise((resolve, reject) => {
            const request = store.getAll();
            request.onsuccess = () => resolve(request.result.filter((r: any) => r.collection === this.collection).map((r: any) => r.value));
            request.onerror = () => reject(request.error);
        });
    }

    async save(entity: any): Promise<void> {
        const tx = this.adapter.transaction(["repositories"], "readwrite");
        const store = tx.objectStore("repositories");

        const key = entity.id ?? entity.key ?? `${this.collection}:${Date.now()}`;

        await new Promise<void>((resolve, reject) => {
            const request = store.put({ key, collection: this.collection, value: entity });
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    async delete(key: string): Promise<void> {
        const tx = this.adapter.transaction(["repositories"], "readwrite");
        const store = tx.objectStore("repositories");

        await new Promise<void>((resolve, reject) => {
            const request = store.delete(key);
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    async exists(key: string): Promise<boolean> {
        const tx = this.adapter.transaction(["repositories"], "readonly");
        const store = tx.objectStore("repositories");

        return new Promise((resolve, reject) => {
            const request = store.getKey(key);
            request.onsuccess = () => resolve(request.result !== undefined);
            request.onerror = () => reject(request.error);
        });
    }
}
