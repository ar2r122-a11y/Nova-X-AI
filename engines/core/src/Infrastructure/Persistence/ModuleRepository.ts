import { IModuleRepository } from "../../Contracts/IModuleRepository";
import { ModuleRegistrationEntity } from "../../Domain/Entities/ModuleRegistrationEntity";

/**
 * Nova X AI
 * Nova Core
 * ModuleRepository — in-memory implementation
 *
 * Implements IModuleRepository (Contracts/IModuleRepository.ts).
 * Stores ModuleRegistrationEntity instances keyed by moduleName.
 * A persistent implementation (IndexedDB / Storage Engine) will replace
 * this once the Storage Engine is available.
 *
 * SDS §1: Nova Core manages module registration and lifecycle.
 */
export class ModuleRepository implements IModuleRepository {

    private readonly modules =
        new Map<string, ModuleRegistrationEntity>();

    public async save(
        module: ModuleRegistrationEntity
    ): Promise<void> {

        this.modules.set(
            module.moduleName,
            module
        );

    }

    public async findByName(
        name: string
    ): Promise<ModuleRegistrationEntity | null> {

        return this.modules.get(name) ?? null;

    }

    public async getAll(): Promise<ModuleRegistrationEntity[]> {

        return [...this.modules.values()];

    }

    public async remove(
        name: string
    ): Promise<void> {

        this.modules.delete(name);

    }

}
