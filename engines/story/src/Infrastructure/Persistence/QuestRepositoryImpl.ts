import type { IStorageEngine } from "@nova-x-ai/storage";
import type { IQuestRepository } from "../../Domain/Repositories/IQuestRepository";
import { QuestAggregate } from "../../Domain/Aggregates/QuestAggregate";
import { QuestId } from "../../Domain/ValueObjects/QuestId";
import { StoryId } from "../../Domain/ValueObjects/StoryId";
import { QuestTypeRef } from "../../Domain/ValueObjects/QuestType";
import { QuestStatusRef } from "../../Domain/ValueObjects/QuestStatus";
import { Objective } from "../../Domain/Entities/Objective";
import { StoryVersion } from "../../Domain/ValueObjects/StoryVersion";

interface StoredQuestEntity {
    id: string;
    data: string;
}

export class QuestRepositoryImpl implements IQuestRepository {
    private readonly storageRepository: {
        getById(key: string): Promise<StoredQuestEntity | null>;
        save(entity: StoredQuestEntity): Promise<void>;
        delete(key: string): Promise<void>;
        exists(key: string): Promise<boolean>;
        getAll(): Promise<StoredQuestEntity[]>;
    };

    constructor(storageEngine: IStorageEngine) {
        const repo = storageEngine.getRepository<StoredQuestEntity>("quests");
        this.storageRepository = {
            getById: (key) => repo.getById(key),
            save: (entity) => repo.save(entity),
            delete: (key) => repo.delete(key),
            exists: (key) => repo.exists(key),
            getAll: () => repo.getAll(),
        };
    }

    async save(quest: QuestAggregate): Promise<void> {
        const snapshot = quest.getSnapshot();
        const serialized = JSON.stringify(snapshot);
        const entity: StoredQuestEntity = {
            id: quest.getQuestId().getValue(),
            data: serialized,
        };
        await this.storageRepository.save(entity);
    }

    async getById(questId: QuestId): Promise<QuestAggregate | null> {
        const entity = await this.storageRepository.getById(questId.getValue());
        if (!entity) {
            return null;
        }
        const snapshot = JSON.parse(entity.data);
        return this.reconstitute(snapshot);
    }

    async getByStoryId(storyId: StoryId): Promise<QuestAggregate[]> {
        const entities = await this.storageRepository.getAll();
        const filtered = entities.filter((e) => {
            const snapshot = JSON.parse(e.data);
            return snapshot.storyId === storyId.getValue();
        });
        return filtered.map((entity) => {
            const snapshot = JSON.parse(entity.data);
            return this.reconstitute(snapshot);
        });
    }

    async delete(questId: QuestId): Promise<void> {
        await this.storageRepository.delete(questId.getValue());
    }

    private reconstitute(snapshot: any): QuestAggregate {
        const questId = QuestId.create(snapshot.questId);
        const storyId = StoryId.create(snapshot.storyId);
        const type = QuestTypeRef.create(snapshot.type);
        const status = QuestStatusRef.create(snapshot.status);
        const version = StoryVersion.create(snapshot.version);

        const objectives = (snapshot.objectives || []).map((o: any) =>
            Objective.reconstitute({
                objectiveId: o.objectiveId,
                questId,
                description: o.description,
                type: o.type,
                status: o.status,
                requiredFlags: new Map(Object.entries(o.requiredFlags || {})),
                completionCriteria: new Map(Object.entries(o.completionCriteria || {})),
                progress: o.progress,
                createdAt: o.createdAt,
                updatedAt: o.updatedAt,
            })
        );

        return QuestAggregate.reconstitute({
            questId,
            storyId,
            title: snapshot.title,
            description: snapshot.description,
            type,
            status,
            objectives,
            rewards: new Map(Object.entries(snapshot.rewards || {})),
            prerequisites: snapshot.prerequisites || [],
            narrativeFlags: new Map(Object.entries(snapshot.narrativeFlags || {})),
            version,
            createdAt: snapshot.createdAt,
            updatedAt: snapshot.updatedAt,
        });
    }
}
