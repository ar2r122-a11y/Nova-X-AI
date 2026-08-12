import { ImageAggregate } from "../Domain/Aggregates";

export interface IImageRepository {
    findById(id: string): Promise<ImageAggregate | null>;
    save(aggregate: ImageAggregate): Promise<void>;
    delete(id: string): Promise<void>;
    exists(id: string): Promise<boolean>;
    getBySessionId(sessionId: string): Promise<ImageAggregate[]>;
    getByOwnerId(ownerId: string): Promise<ImageAggregate[]>;
}
