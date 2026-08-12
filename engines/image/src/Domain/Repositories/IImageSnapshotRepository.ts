
export interface IImageSnapshotRepository {
    saveSnapshot(imageId: string, snapshot: unknown): Promise<void>;
    getSnapshot(imageId: string): Promise<unknown | null>;
    deleteSnapshot(imageId: string): Promise<void>;
    getAllSnapshots(): Promise<Map<string, unknown>>;
    compact(): Promise<void>;
}
