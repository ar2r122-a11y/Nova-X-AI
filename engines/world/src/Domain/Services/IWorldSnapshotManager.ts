export interface IWorldSnapshotManager {
    takeSnapshot(worldId: string): Promise<object>;
    restoreFromSnapshot(worldId: string, snapshot: object): Promise<void>;
    listSnapshots(worldId: string): Promise<{ timestamp: number; version: number }[]>;
    deleteSnapshot(worldId: string, timestamp: number): Promise<void>;
}
