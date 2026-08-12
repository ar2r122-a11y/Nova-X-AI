
export interface IImageRepository {
    findById(id: string): Promise<unknown | null>;
    save(image: unknown): Promise<void>;
    delete(id: string): Promise<void>;
    exists(id: string): Promise<boolean>;
    getAll(): Promise<unknown[]>;
    getBySessionId(sessionId: string): Promise<unknown[]>;
    getByOwnerId(ownerId: string): Promise<unknown[]>;
}
