import type { IStoryRepository } from "../../Domain/Repositories/IStoryRepository";
import type { IQuestRepository } from "../../Domain/Repositories/IQuestRepository";
import type { IEndingRegistryRepository } from "../../Domain/Repositories/IEndingRegistryRepository";

export class StoryRepositoryRegistry {
    private readonly repositories = new Map<string, unknown>();

    registerStoryRepository(name: string, repository: IStoryRepository): void {
        this.repositories.set(name, repository);
    }

    registerQuestRepository(name: string, repository: IQuestRepository): void {
        this.repositories.set(name, repository);
    }

    registerEndingRegistryRepository(name: string, repository: IEndingRegistryRepository): void {
        this.repositories.set(name, repository);
    }

    getStoryRepository(name: string): IStoryRepository | undefined {
        return this.repositories.get(name) as IStoryRepository | undefined;
    }

    getQuestRepository(name: string): IQuestRepository | undefined {
        return this.repositories.get(name) as IQuestRepository | undefined;
    }

    getEndingRegistryRepository(name: string): IEndingRegistryRepository | undefined {
        return this.repositories.get(name) as IEndingRegistryRepository | undefined;
    }
}
