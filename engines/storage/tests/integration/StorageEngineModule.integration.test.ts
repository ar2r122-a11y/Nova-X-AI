import { describe, it, expect } from "vitest";
import { StorageEngineModule } from "../../src/Presentation/StorageEngineModule";
import type { IStorageEngine } from "../../src/Contracts";

describe("StorageEngineModule integration", () => {
    it("should initialize and expose storage engine interfaces", async () => {
        const module = new StorageEngineModule();
        const container = {
            registerSingleton: () => {},
            registerTransient: () => {},
            registerScoped: () => {},
            registerInstance: () => {},
            isRegistered: () => false,
            resolve: () => ({} as any),
            remove: () => {},
            clear: () => {},
            createScope: () => ({} as any),
            getRegisteredServices: () => []
        } as any;

        module.configureServices(container);
        await module.onInit();

        const storage = module.getStorage();
        expect(storage).not.toBeNull();
        expect(storage!.getRepository).toBeDefined();
        expect(storage!.getUnitOfWork).toBeDefined();
        expect(storage!.getEventStore).toBeDefined();
        expect(storage!.getSnapshotStore).toBeDefined();
        expect(storage!.getProjectionStore).toBeDefined();
        expect(storage!.getWAL).toBeDefined();
        expect(storage!.getDeltaLog).toBeDefined();
        expect(storage!.getBackupStore).toBeDefined();
        expect(storage!.getQuotaPolicy).toBeDefined();
        expect(storage!.getCompressionEngine).toBeDefined();
        expect(storage!.getDeduplicationEngine).toBeDefined();
        expect(storage!.getEncryptionBoundary).toBeDefined();
        expect(storage!.getCacheProvider).toBeDefined();
        expect(storage!.getMigrationRunner).toBeDefined();

        await module.onDestroy();
    });

    it("should create repositories via getRepository", async () => {
        const module = new StorageEngineModule();
        const container = {
            registerSingleton: () => {},
            registerTransient: () => {},
            registerScoped: () => {},
            registerInstance: () => {},
            isRegistered: () => false,
            resolve: () => ({} as any),
            remove: () => {},
            clear: () => {},
            createScope: () => ({} as any),
            getRegisteredServices: () => []
        } as any;

        module.configureServices(container);
        await module.onInit();

        const storage = module.getStorage()!;
        const repo = storage.getRepository<any>("test-collection");
        expect(repo).toBeDefined();
        expect(repo.getById).toBeDefined();
        expect(repo.getAll).toBeDefined();
        expect(repo.save).toBeDefined();
        expect(repo.delete).toBeDefined();
        expect(repo.exists).toBeDefined();

        await module.onDestroy();
    });
});
