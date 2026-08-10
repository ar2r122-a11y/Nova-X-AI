import type { IRepository, IUnitOfWork, IRepositoryFactory } from "../../Contracts";

export class UnitOfWork implements IUnitOfWork {
    private readonly repositories = new Map<string, IRepository<any>>();
    private readonly changes = new Map<string, { before: unknown; after: unknown }>();
    private committed = false;
    private rolledback = false;

    constructor(
        public readonly transactionId: string,
        private readonly repositoryFactory: IRepositoryFactory
    ) {}

    getRepository<T>(collection: string): IRepository<T> {
        if (!this.repositories.has(collection)) {
            const repo = this.repositoryFactory.createRepository<T>(collection);
            this.repositories.set(collection, repo);
        }
        return this.repositories.get(collection)!;
    }

    async commit(): Promise<void> {
        if (this.committed || this.rolledback) {
            throw new Error("Transaction already completed.");
        }

        for (const [, repo] of this.repositories) {
            for (const [, change] of this.changes) {
                await repo.save(change.after);
            }
        }

        this.committed = true;
    }

    async rollback(): Promise<void> {
        if (this.committed || this.rolledback) {
            throw new Error("Transaction already completed.");
        }

        this.changes.clear();
        this.rolledback = true;
    }

    isActive(): boolean {
        return !this.committed && !this.rolledback;
    }

    registerChange(_key: string, before: unknown, after: unknown): void {
        if (this.committed || this.rolledback) {
            throw new Error("Transaction already completed.");
        }
        this.changes.set(_key, { before, after });
    }
}
