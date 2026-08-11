import type { IStoryRepository } from "../../Domain/Repositories/IStoryRepository";
import type { IQuestRepository } from "../../Domain/Repositories/IQuestRepository";
import type { IEndingRegistryRepository } from "../../Domain/Repositories/IEndingRegistryRepository";
import { StoryRepositoryRegistry } from "./StoryRepositoryRegistry";

export class StoryRepositoryResolver {
    constructor(private readonly registry: StoryRepositoryRegistry) {}

    resolveStoryRepository(name: string): IStoryRepository {
        const repository = this.registry.getStoryRepository(name);
        if (!repository) {
            throw new Error(`StoryRepository not found: ${name}`);
        }
        return repository;
    }

    resolveQuestRepository(name: string): IQuestRepository {
        const repository = this.registry.getQuestRepository(name);
        if (!repository) {
            throw new Error(`QuestRepository not found: ${name}`);
        }
        return repository;
    }

    resolveEndingRegistryRepository(name: string): IEndingRegistryRepository {
        const repository = this.registry.getEndingRegistryRepository(name);
        if (!repository) {
            throw new Error(`EndingRegistryRepository not found: ${name}`);
        }
        return repository;
    }
}
