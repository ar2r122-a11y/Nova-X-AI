import { IModuleRepository } from "../../Contracts/IModuleRepository";
import { ModuleRegistrationEntity } from "../../Domain/Entities/ModuleRegistrationEntity";

export class ModuleRepository implements IModuleRepository {

    private readonly modules = new Map<string, ModuleRegistrationEntity>();

    public async save(module: ModuleRegistrationEntity): Promise<void> {
        this.modules.set(module.getId(), module);
    }

    public async getById(id: string): Promise<ModuleRegistrationEntity | null> {
        return this.modules.get(id) ?? null;
    }

    public async getAll(): Promise<ModuleRegistrationEntity[]> {
        return [...this.modules.values()];
    }

    public async remove(id: string): Promise<void> {
        this.modules.delete(id);
    }

}