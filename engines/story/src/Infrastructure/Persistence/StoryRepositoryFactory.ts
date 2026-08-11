import type { IStorageEngine } from "@nova-x-ai/storage";
import type { IStoryRepository } from "../../Domain/Repositories/IStoryRepository";
import type { IQuestRepository } from "../../Domain/Repositories/IQuestRepository";
import type { IEndingRegistryRepository } from "../../Domain/Repositories/IEndingRegistryRepository";
import type { IStoryEventStoreRepository } from "../../Domain/Repositories/IStoryEventStoreRepository";
import { StoryRepositoryImpl } from "./StoryRepositoryImpl";
import { QuestRepositoryImpl } from "./QuestRepositoryImpl";
import { EndingRegistryRepositoryImpl } from "./EndingRegistryRepositoryImpl";
import { StoryEventStoreRepository } from "../EventStore/StoryEventStoreRepository";

export class StoryRepositoryFactory {
    static createRepositories(storageEngine: IStorageEngine): {
        storyRepository: IStoryRepository;
        questRepository: IQuestRepository;
        endingRegistryRepository: IEndingRegistryRepository;
        eventStoreRepository: IStoryEventStoreRepository;
    } {
        return {
            storyRepository: new StoryRepositoryImpl(storageEngine),
            questRepository: new QuestRepositoryImpl(storageEngine),
            endingRegistryRepository: new EndingRegistryRepositoryImpl(storageEngine),
            eventStoreRepository: new StoryEventStoreRepository(storageEngine.getEventStore()),
        };
    }
}
