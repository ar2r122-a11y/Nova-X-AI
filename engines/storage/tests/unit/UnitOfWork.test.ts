import { describe, it, expect } from "vitest";
import { UnitOfWork } from "../../src/Infrastructure/Persistence/UnitOfWork.ts";
import type { IRepositoryFactory, IRepository } from "../../src/Contracts/index.ts";

describe("UnitOfWork", () => {
    const createRepo = <T>(): IRepository<T> => ({
        getById: async () => null,
        getAll: async () => [],
        save: async () => {},
        delete: async () => {},
        exists: async () => false
    });

    const createFactory = (): IRepositoryFactory => ({
        createRepository: () => createRepo(),
        registerRepository: () => {},
        getRepository: () => createRepo()
    });

    it("should create with transaction id", () => {
        const uow = new UnitOfWork("tx-1", createFactory());
        expect(uow.transactionId).toBe("tx-1");
        expect(uow.isActive()).toBe(true);
    });

    it("should commit changes", async () => {
        const uow = new UnitOfWork("tx-1", createFactory());
        const repo = uow.getRepository<any>("test");
        await repo.save({ id: "1" });
        await uow.commit();
        expect(uow.isActive()).toBe(false);
    });

    it("should rollback", async () => {
        const uow = new UnitOfWork("tx-1", createFactory());
        await uow.rollback();
        expect(uow.isActive()).toBe(false);
    });
});
