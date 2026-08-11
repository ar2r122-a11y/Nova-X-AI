export interface IStorySnapshotManager {
    takeSnapshot(storyId: string): Promise<object>;
    restoreFromSnapshot(storyId: string, snapshot: object): Promise<void>;
    listSnapshots(storyId: string): Promise<{ timestamp: number; version: number }[]>;
    deleteSnapshot(storyId: string, timestamp: number): Promise<void>;
    shouldCreateSnapshot(version: number): boolean;
}
