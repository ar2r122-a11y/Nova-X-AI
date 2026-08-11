import type { IStorageEngine } from "@nova-x-ai/storage";
import type { IStoryRepository } from "../../Domain/Repositories/IStoryRepository";
import { StoryAggregate } from "../../Domain/Aggregates/StoryAggregate";
import { StoryId } from "../../Domain/ValueObjects/StoryId";
import { Chapter } from "../../Domain/Entities/Chapter";
import { Scene } from "../../Domain/Entities/Scene";
import { Quest } from "../../Domain/Entities/Quest";
import { Ending } from "../../Domain/Entities/Ending";
import { Branch } from "../../Domain/Entities/Branch";
import { Objective } from "../../Domain/Entities/Objective";
import { StoryProgress } from "../../Domain/ValueObjects/StoryProgress";
import { StoryStateRef } from "../../Domain/ValueObjects/StoryState";
import { StoryStatusRef } from "../../Domain/ValueObjects/StoryStatus";
import { StoryVersion } from "../../Domain/ValueObjects/StoryVersion";

interface StoredStoryEntity {
    id: string;
    data: string;
}

export class StoryRepositoryImpl implements IStoryRepository {
    private readonly storageRepository: {
        getById(key: string): Promise<StoredStoryEntity | null>;
        save(entity: StoredStoryEntity): Promise<void>;
        delete(key: string): Promise<void>;
        exists(key: string): Promise<boolean>;
        getAll(): Promise<StoredStoryEntity[]>;
    };

    constructor(storageEngine: IStorageEngine) {
        const repo = storageEngine.getRepository<StoredStoryEntity>("stories");
        this.storageRepository = {
            getById: (key) => repo.getById(key),
            save: (entity) => repo.save(entity),
            delete: (key) => repo.delete(key),
            exists: (key) => repo.exists(key),
            getAll: () => repo.getAll(),
        };
    }

    async save(story: StoryAggregate): Promise<void> {
        const snapshot = story.getSnapshot();
        const serialized = JSON.stringify(snapshot);
        const entity: StoredStoryEntity = {
            id: story.getStoryId().getValue(),
            data: serialized,
        };
        await this.storageRepository.save(entity);
    }

    async getById(storyId: StoryId): Promise<StoryAggregate | null> {
        const entity = await this.storageRepository.getById(storyId.getValue());
        if (!entity) {
            return null;
        }
        const snapshot = JSON.parse(entity.data);
        return this.reconstitute(snapshot);
    }

    async getAll(): Promise<StoryAggregate[]> {
        const entities = await this.storageRepository.getAll();
        return entities.map((entity) => {
            const snapshot = JSON.parse(entity.data);
            return this.reconstitute(snapshot);
        });
    }

    async delete(storyId: StoryId): Promise<void> {
        await this.storageRepository.delete(storyId.getValue());
    }

    async exists(storyId: StoryId): Promise<boolean> {
        return this.storageRepository.exists(storyId.getValue());
    }

    private reconstitute(snapshot: any): StoryAggregate {
        const storyId = StoryId.create(snapshot.storyId);
        const state = StoryStateRef.create(snapshot.state);
        const status = StoryStatusRef.create(snapshot.status);
        const version = StoryVersion.create(snapshot.version);
        const progress = StoryProgress.create(snapshot.progress);

        const chapters = (snapshot.chapters || []).map((c: any) =>
            Chapter.reconstitute({
                chapterId: c.chapterId,
                storyId,
                title: c.title,
                status: c.status,
                order: c.order,
                sceneIds: (c.sceneIds || []).map((id: string) => id),
                createdAt: c.createdAt,
                updatedAt: c.updatedAt,
            })
        );

        const scenes = (snapshot.scenes || []).map((s: any) =>
            Scene.reconstitute({
                sceneId: s.sceneId,
                chapterId: s.chapterId,
                title: s.title,
                description: s.description,
                status: s.status,
                type: s.type,
                choices: s.choices || [],
                prerequisites: (s.prerequisites || []).map((p: any) => ({
                    sceneId: p.sceneId,
                    required: p.required,
                })),
                narrativeFlags: new Map(Object.entries(s.narrativeFlags || {})),
                order: s.order,
                createdAt: s.createdAt,
                updatedAt: s.updatedAt,
            })
        );

        const quests = (snapshot.quests || []).map((q: any) =>
            Quest.reconstitute({
                questId: q.questId,
                storyId,
                title: q.title,
                description: q.description,
                type: q.type,
                status: q.status,
                objectives: (q.objectives || []).map((o: any) =>
                    Objective.reconstitute({
                        objectiveId: o.objectiveId,
                        questId: q.questId,
                        description: o.description,
                        type: o.type,
                        status: o.status,
                        requiredFlags: new Map(Object.entries(o.requiredFlags || {})),
                        completionCriteria: new Map(Object.entries(o.completionCriteria || {})),
                        progress: o.progress,
                        createdAt: o.createdAt,
                        updatedAt: o.updatedAt,
                    })
                ),
                rewards: new Map(Object.entries(q.rewards || {})),
                prerequisites: q.prerequisites || [],
                narrativeFlags: new Map(Object.entries(q.narrativeFlags || {})),
                createdAt: q.createdAt,
                updatedAt: q.updatedAt,
            })
        );

        const endings = (snapshot.endings || []).map((e: any) =>
            Ending.reconstitute({
                endingId: e.endingId,
                storyId,
                title: e.title,
                description: e.description,
                type: e.type,
                conditions: new Map(Object.entries(e.conditions || {})),
                narrativeFlags: new Map(Object.entries(e.narrativeFlags || {})),
                isUnlocked: e.isUnlocked,
                createdAt: e.createdAt,
                updatedAt: e.updatedAt,
            })
        );

        const branches = (snapshot.branches || []).map((b: any) =>
            Branch.reconstitute({
                branchId: b.branchId,
                storyId,
                sourceSceneId: b.sourceSceneId,
                targetSceneId: b.targetSceneId,
                condition: b.condition,
                priority: b.priority,
                isActive: b.isActive,
                createdAt: b.createdAt,
                updatedAt: b.updatedAt,
            })
        );

        const flags = new Map(Object.entries(snapshot.flags || {}));

        return StoryAggregate.reconstitute({
            storyId,
            title: snapshot.title,
            description: snapshot.description,
            state,
            status,
            chapters,
            scenes,
            quests,
            endings,
            branches,
            flags,
            progress,
            version,
            createdAt: snapshot.createdAt,
            updatedAt: snapshot.updatedAt,
        });
    }
}
