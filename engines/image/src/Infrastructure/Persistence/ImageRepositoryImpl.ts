import type { IStorageEngine } from "@nova-x-ai/storage";
import type { IImageRepository, IRenderJobRepository, IImageAssetRepository, IImageCandidateRepository } from "../../Contracts";
import { ImageAggregate } from "../../Domain/Aggregates/ImageAggregate";
import { RenderJob } from "../../Domain/Entities/RenderJob";
import { ImageAsset } from "../../Domain/Entities/ImageAsset";
import { ImageCandidate } from "../../Domain/Entities/ImageCandidate";

interface StoredImageEntity {
    id: string;
    data: string;
}

interface StoredRenderJobEntity {
    id: string;
    data: string;
}

interface StoredAssetEntity {
    id: string;
    data: string;
}

interface StoredCandidateEntity {
    id: string;
    data: string;
}

export class ImageRepositoryImpl implements IImageRepository {
    private readonly storageRepository: {
        getById(key: string): Promise<StoredImageEntity | null>;
        save(entity: StoredImageEntity): Promise<void>;
        delete(key: string): Promise<void>;
        exists(key: string): Promise<boolean>;
        getAll(): Promise<StoredImageEntity[]>;
    };

    constructor(storageEngine: IStorageEngine) {
        const repo = storageEngine.getRepository<StoredImageEntity>("images");
        this.storageRepository = {
            getById: (key) => repo.getById(key),
            save: (entity) => repo.save(entity),
            delete: (key) => repo.delete(key),
            exists: (key) => repo.exists(key),
            getAll: () => repo.getAll()
        };
    }

    async findById(id: string): Promise<ImageAggregate | null> {
        const entity = await this.storageRepository.getById(id);
        if (!entity) {
            return null;
        }
        return ImageAggregate.fromSnapshot(JSON.parse(entity.data));
    }

    async save(aggregate: ImageAggregate): Promise<void> {
        const snapshot = aggregate.getSnapshot();
        const serialized = JSON.stringify(snapshot);
        const entity: StoredImageEntity = {
            id: aggregate.getId().getValue(),
            data: serialized
        };
        await this.storageRepository.save(entity);
    }

    async delete(id: string): Promise<void> {
        await this.storageRepository.delete(id);
    }

    async exists(id: string): Promise<boolean> {
        return this.storageRepository.exists(id);
    }

    async getBySessionId(sessionId: string): Promise<ImageAggregate[]> {
        const entities = await this.storageRepository.getAll();
        return entities
            .map((e) => ImageAggregate.fromSnapshot(JSON.parse(e.data)))
            .filter((a) => a.getSessionId().getValue() === sessionId);
    }

    async getByOwnerId(ownerId: string): Promise<ImageAggregate[]> {
        const entities = await this.storageRepository.getAll();
        return entities
            .map((e) => ImageAggregate.fromSnapshot(JSON.parse(e.data)))
            .filter((a) => a.getOwnerId() === ownerId);
    }
}

export class RenderJobRepositoryImpl implements IRenderJobRepository {
    private readonly storageRepository: {
        getById(key: string): Promise<StoredRenderJobEntity | null>;
        save(entity: StoredRenderJobEntity): Promise<void>;
        delete(key: string): Promise<void>;
        exists(key: string): Promise<boolean>;
        getAll(): Promise<StoredRenderJobEntity[]>;
    };

    constructor(storageEngine: IStorageEngine) {
        const repo = storageEngine.getRepository<StoredRenderJobEntity>("render_jobs");
        this.storageRepository = {
            getById: (key) => repo.getById(key),
            save: (entity) => repo.save(entity),
            delete: (key) => repo.delete(key),
            exists: (key) => repo.exists(key),
            getAll: () => repo.getAll()
        };
    }

    async findById(id: string): Promise<RenderJob | null> {
        const entity = await this.storageRepository.getById(id);
        if (!entity) {
            return null;
        }
        return RenderJob.fromSnapshot(JSON.parse(entity.data));
    }

    async save(job: RenderJob): Promise<void> {
        const snapshot = RenderJob.toSnapshot(job);
        const serialized = JSON.stringify(snapshot);
        const entity: StoredRenderJobEntity = {
            id: job.id,
            data: serialized
        };
        await this.storageRepository.save(entity);
    }

    async delete(id: string): Promise<void> {
        await this.storageRepository.delete(id);
    }

    async exists(id: string): Promise<boolean> {
        return this.storageRepository.exists(id);
    }

    async getByImageId(imageId: string): Promise<RenderJob[]> {
        const entities = await this.storageRepository.getAll();
        return entities
            .map((e) => RenderJob.fromSnapshot(JSON.parse(e.data)))
            .filter((job) => job.imageId.getValue() === imageId);
    }

    async getActiveJobs(): Promise<RenderJob[]> {
        const all = await this.storageRepository.getAll();
        return all
            .map((e) => RenderJob.fromSnapshot(JSON.parse(e.data)))
            .filter((job) => job.status === "processing" || job.status === "pending");
    }
}

export class ImageAssetRepositoryImpl implements IImageAssetRepository {
    private readonly storageRepository: {
        getById(key: string): Promise<StoredAssetEntity | null>;
        save(entity: StoredAssetEntity): Promise<void>;
        delete(key: string): Promise<void>;
        exists(key: string): Promise<boolean>;
        getAll(): Promise<StoredAssetEntity[]>;
    };

    constructor(storageEngine: IStorageEngine) {
        const repo = storageEngine.getRepository<StoredAssetEntity>("image_assets");
        this.storageRepository = {
            getById: (key) => repo.getById(key),
            save: (entity) => repo.save(entity),
            delete: (key) => repo.delete(key),
            exists: (key) => repo.exists(key),
            getAll: () => repo.getAll()
        };
    }

    async findById(id: string): Promise<ImageAsset | null> {
        const entity = await this.storageRepository.getById(id);
        if (!entity) {
            return null;
        }
        return ImageAsset.fromSnapshot(JSON.parse(entity.data));
    }

    async save(asset: ImageAsset): Promise<void> {
        const snapshot = ImageAsset.toSnapshot(asset);
        const serialized = JSON.stringify(snapshot);
        const entity: StoredAssetEntity = {
            id: asset.assetId.getValue(),
            data: serialized
        };
        await this.storageRepository.save(entity);
    }

    async delete(id: string): Promise<void> {
        await this.storageRepository.delete(id);
    }

    async exists(id: string): Promise<boolean> {
        return this.storageRepository.exists(id);
    }

    async getByImageId(imageId: string): Promise<ImageAsset[]> {
        const entities = await this.storageRepository.getAll();
        return entities
            .map((e) => ImageAsset.fromSnapshot(JSON.parse(e.data)))
            .filter((a) => a.imageId === imageId);
    }

    async getByCandidateId(candidateId: string): Promise<ImageAsset[]> {
        const entities = await this.storageRepository.getAll();
        return entities
            .map((e) => ImageAsset.fromSnapshot(JSON.parse(e.data)))
            .filter((a) => a.candidateId === candidateId);
    }

    async getPrimaryAvatar(imageId: string): Promise<ImageAsset | null> {
        const all = await this.getByImageId(imageId);
        return all.find((a) => a.isPrimary && a.isAvatar) ?? null;
    }
}

export class ImageCandidateRepositoryImpl implements IImageCandidateRepository {
    private readonly storageRepository: {
        getById(key: string): Promise<StoredCandidateEntity | null>;
        save(entity: StoredCandidateEntity): Promise<void>;
        delete(key: string): Promise<void>;
        exists(key: string): Promise<boolean>;
        getAll(): Promise<StoredCandidateEntity[]>;
    };

    constructor(storageEngine: IStorageEngine) {
        const repo = storageEngine.getRepository<StoredCandidateEntity>("image_candidates");
        this.storageRepository = {
            getById: (key) => repo.getById(key),
            save: (entity) => repo.save(entity),
            delete: (key) => repo.delete(key),
            exists: (key) => repo.exists(key),
            getAll: () => repo.getAll()
        };
    }

    async findById(id: string): Promise<ImageCandidate | null> {
        const entity = await this.storageRepository.getById(id);
        if (!entity) {
            return null;
        }
        return ImageCandidate.fromSnapshot(JSON.parse(entity.data));
    }

    async save(candidate: ImageCandidate): Promise<void> {
        const snapshot = ImageCandidate.toSnapshot(candidate);
        const serialized = JSON.stringify(snapshot);
        const entity: StoredCandidateEntity = {
            id: candidate.candidateId,
            data: serialized
        };
        await this.storageRepository.save(entity);
    }

    async delete(id: string): Promise<void> {
        await this.storageRepository.delete(id);
    }

    async exists(id: string): Promise<boolean> {
        return this.storageRepository.exists(id);
    }

    async getByImageId(imageId: string): Promise<ImageCandidate[]> {
        const entities = await this.storageRepository.getAll();
        return entities
            .map((e) => ImageCandidate.fromSnapshot(JSON.parse(e.data)))
            .filter((c) => c.imageId === imageId);
    }

    async getSelectedCandidate(imageId: string): Promise<ImageCandidate | null> {
        const all = await this.getByImageId(imageId);
        return all.find((c) => c.isSelected) ?? null;
    }
}

export class ImageSnapshotRepositoryImpl {
    private readonly storageRepository: {
        save(entity: { id: string; data: string }): Promise<void>;
        getById(key: string): Promise<{ id: string; data: string } | null>;
        delete(key: string): Promise<void>;
        getAll(): Promise<{ id: string; data: string }[]>;
    };

    constructor(storageEngine: IStorageEngine) {
        const repo = storageEngine.getRepository<{ id: string; data: string }>("image_snapshots");
        this.storageRepository = {
            save: (entity) => repo.save(entity),
            getById: (key) => repo.getById(key),
            delete: (key) => repo.delete(key),
            getAll: () => repo.getAll()
        };
    }

    async saveSnapshot(imageId: string, snapshot: Record<string, unknown>): Promise<void> {
        const entity = { id: imageId, data: JSON.stringify(snapshot) };
        await this.storageRepository.save(entity);
    }

    async getSnapshot(imageId: string): Promise<Record<string, unknown> | null> {
        const entity = await this.storageRepository.getById(imageId);
        if (!entity) {
            return null;
        }
        return JSON.parse(entity.data);
    }

    async deleteSnapshot(imageId: string): Promise<void> {
        await this.storageRepository.delete(imageId);
    }

    async getAllSnapshots(): Promise<Array<{ id: string; snapshot: Record<string, unknown> }>> {
        const entities = await this.storageRepository.getAll();
        return entities.map((e) => ({ id: e.id, snapshot: JSON.parse(e.data) }));
    }

    async compact(): Promise<void> {
        const all = await this.storageRepository.getAll();
        for (const entity of all) {
            const snapshot = JSON.parse(entity.data);
            if (snapshot.compact) {
                await this.storageRepository.delete(entity.id);
            }
        }
    }
}
