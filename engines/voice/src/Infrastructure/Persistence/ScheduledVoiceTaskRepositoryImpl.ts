import type { IStorageEngine } from "@nova-x-ai/storage";
import type { IScheduledVoiceTaskRepository } from "../../Domain/Repositories/IScheduledVoiceTaskRepository";
import { ScheduledVoiceTaskEntity } from "../../Domain/Entities/ScheduledVoiceTaskEntity";

interface StoredScheduledTaskEntity {
    id: string;
    data: string;
}

export class ScheduledVoiceTaskRepositoryImpl implements IScheduledVoiceTaskRepository {
    private readonly storageRepository: {
        getById(key: string): Promise<StoredScheduledTaskEntity | null>;
        save(entity: StoredScheduledTaskEntity): Promise<void>;
        delete(key: string): Promise<void>;
        exists(key: string): Promise<boolean>;
        getAll(): Promise<StoredScheduledTaskEntity[]>;
    };

    constructor(storageEngine: IStorageEngine) {
        const repo = storageEngine.getRepository<StoredScheduledTaskEntity>("scheduled-voice-tasks");
        this.storageRepository = {
            getById: (key) => repo.getById(key),
            save: (entity) => repo.save(entity),
            delete: (key) => repo.delete(key),
            exists: (key) => repo.exists(key),
            getAll: () => repo.getAll()
        };
    }

    async findById(taskId: string): Promise<ScheduledVoiceTaskEntity | null> {
        const entity = await this.storageRepository.getById(taskId);
        if (!entity) {
            return null;
        }
        const snapshot = JSON.parse(entity.data);
        return ScheduledVoiceTaskEntity.reconstitute(
            snapshot.taskId,
            snapshot.voiceId,
            snapshot.text,
            snapshot.profileId,
            snapshot.scheduledAt,
            snapshot.priority,
            snapshot.maxRetries,
            snapshot.retryCount,
            snapshot.status,
            snapshot.lastError,
            snapshot.createdAt,
            snapshot.updatedAt
        );
    }

    async findByVoiceId(voiceId: string): Promise<ScheduledVoiceTaskEntity[]> {
        const all = await this.storageRepository.getAll();
        return all
            .filter((e: StoredScheduledTaskEntity) => JSON.parse(e.data).voiceId === voiceId)
            .map((e: StoredScheduledTaskEntity) => {
                const snapshot = JSON.parse(e.data);
                return ScheduledVoiceTaskEntity.reconstitute(
                    snapshot.taskId,
                    snapshot.voiceId,
                    snapshot.text,
                    snapshot.profileId,
                    snapshot.scheduledAt,
                    snapshot.priority,
                    snapshot.maxRetries,
                    snapshot.retryCount,
                    snapshot.status,
                    snapshot.lastError,
                    snapshot.createdAt,
                    snapshot.updatedAt
                );
            });
    }

    async findAll(): Promise<ScheduledVoiceTaskEntity[]> {
        const all = await this.storageRepository.getAll();
        return all.map((e: StoredScheduledTaskEntity) => {
            const snapshot = JSON.parse(e.data);
            return ScheduledVoiceTaskEntity.reconstitute(
                snapshot.taskId,
                snapshot.voiceId,
                snapshot.text,
                snapshot.profileId,
                snapshot.scheduledAt,
                snapshot.priority,
                snapshot.maxRetries,
                snapshot.retryCount,
                snapshot.status,
                snapshot.lastError,
                snapshot.createdAt,
                snapshot.updatedAt
            );
        });
    }

    async save(task: ScheduledVoiceTaskEntity): Promise<void> {
        const snapshot = task.getSnapshot();
        const serialized = JSON.stringify(snapshot);
        const entity: StoredScheduledTaskEntity = {
            id: task.getTaskId(),
            data: serialized
        };
        await this.storageRepository.save(entity);
    }

    async delete(taskId: string): Promise<void> {
        await this.storageRepository.delete(taskId);
    }
}
