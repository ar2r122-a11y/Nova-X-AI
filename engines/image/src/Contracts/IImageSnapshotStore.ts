export interface IImageSnapshotStore {
    saveSnapshot(imageId: string, snapshot: Record<string, unknown>): Promise<void>;
    getSnapshot(imageId: string): Promise<Record<string, unknown> | null>;
    deleteSnapshot(imageId: string): Promise<void>;
    getAllSnapshots(): Promise<Record<string, Record<string, unknown>>[]>;
    compact(): Promise<void>;
}
