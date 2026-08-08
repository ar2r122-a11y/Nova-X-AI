import { ModuleRegistrationEntity } from "../Domain/Entities/ModuleRegistrationEntity";

export interface IModuleRepository {

    save(module: ModuleRegistrationEntity): Promise<void>;

    findByName(name: string): Promise<ModuleRegistrationEntity | null>;

    getAll(): Promise<ModuleRegistrationEntity[]>;

    remove(name: string): Promise<void>;

}