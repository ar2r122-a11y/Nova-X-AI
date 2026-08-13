import type { IRepository } from "@nova-x-ai/storage";
import { ImageAggregate } from "@nova-x-ai/image";

export class ImageRepositoryAdapter {
    constructor(private readonly repo: IRepository<any>) {}

    async findById(id: string): Promise<ImageAggregate | null> {
        const entity = await this.repo.getById(id);
        if (!entity) return null;
        if (entity.data) {
            return ImageAggregate.fromSnapshot(JSON.parse(entity.data));
        }
        return entity as unknown as ImageAggregate | null;
    }

    async save(aggregate: ImageAggregate): Promise<void> {
        const snapshot = aggregate.getSnapshot();
        await this.repo.save({
            id: aggregate.getId().getValue(),
            data: JSON.stringify(snapshot)
        });
    }

    async delete(id: string): Promise<void> {
        await this.repo.delete(id);
    }

    async exists(id: string): Promise<boolean> {
        return this.repo.exists(id);
    }

    async getBySessionId(sessionId: string): Promise<ImageAggregate[]> {
        const all = await this.repo.getAll();
        return all
            .map((e: any) => {
                if (e.data) return ImageAggregate.fromSnapshot(JSON.parse(e.data));
                return e;
            })
            .filter((a: ImageAggregate) => a.getSessionId().getValue() === sessionId);
    }

    async getByOwnerId(ownerId: string): Promise<ImageAggregate[]> {
        const all = await this.repo.getAll();
        return all
            .map((e: any) => {
                if (e.data) return ImageAggregate.fromSnapshot(JSON.parse(e.data));
                return e;
            })
            .filter((a: ImageAggregate) => a.getOwnerId() === ownerId);
    }
}

export class RenderJobRepositoryAdapter {
    constructor(private readonly repo: IRepository<any>) {}

    async findById(id: string): Promise<any> {
        return this.repo.getById(id);
    }

    async save(entity: any): Promise<void> {
        const id = entity.getId?.()?.getValue?.() || entity.id || entity.jobId?.getValue?.();
        if (!entity.id) {
            entity.id = id;
        }
        await this.repo.save(entity);
    }

    async delete(id: string): Promise<void> {
        await this.repo.delete(id);
    }

    async exists(id: string): Promise<boolean> {
        return this.repo.exists(id);
    }

    async getByImageId(imageId: string): Promise<any[]> {
        const all = await this.repo.getAll();
        return all.filter((e: any) => e.imageId === imageId);
    }

    async getActiveJobs(): Promise<any[]> {
        const all = await this.repo.getAll();
        return all.filter((e: any) => e.status === "processing" || e.status === "pending");
    }
}

export class ImageAssetRepositoryAdapter {
    constructor(private readonly repo: IRepository<any>) {}

    async findById(id: string): Promise<any> {
        return this.repo.getById(id);
    }

    async save(entity: any): Promise<void> {
        const id = entity.getId?.()?.getValue?.() || entity.id || entity.assetId?.getValue?.();
        if (!entity.id) {
            entity.id = id;
        }
        await this.repo.save(entity);
    }

    async delete(id: string): Promise<void> {
        await this.repo.delete(id);
    }

    async exists(id: string): Promise<boolean> {
        return this.repo.exists(id);
    }

    async getByImageId(imageId: string): Promise<any[]> {
        const all = await this.repo.getAll();
        return all.filter((e: any) => e.imageId === imageId);
    }

    async getByCandidateId(candidateId: string): Promise<any[]> {
        const all = await this.repo.getAll();
        return all.filter((e: any) => e.candidateId === candidateId);
    }

    async getPrimaryAvatar(imageId: string): Promise<any> {
        const all = await this.getByImageId(imageId);
        return all.find((a: any) => a.isPrimary && a.isAvatar) ?? null;
    }
}

export class ImageCandidateRepositoryAdapter {
    constructor(private readonly repo: IRepository<any>) {}

    async findById(id: string): Promise<any> {
        return this.repo.getById(id);
    }

    async save(entity: any): Promise<void> {
        const id = entity.getId?.()?.getValue?.() || entity.id || entity.candidateId;
        if (!entity.id) {
            entity.id = id;
        }
        await this.repo.save(entity);
    }

    async delete(id: string): Promise<void> {
        await this.repo.delete(id);
    }

    async exists(id: string): Promise<boolean> {
        return this.repo.exists(id);
    }

    async getByImageId(imageId: string): Promise<any[]> {
        const all = await this.repo.getAll();
        return all.filter((e: any) => e.imageId === imageId);
    }

    async getSelectedCandidate(imageId: string): Promise<any> {
        const all = await this.getByImageId(imageId);
        return all.find((c: any) => c.isSelected) ?? null;
    }
}
