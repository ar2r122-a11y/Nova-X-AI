import { StorySnapshot } from "./StorySnapshot";

export class SnapshotFactory {
    static createFromAggregate(storyId: string, aggregateType: string, version: number, data: unknown): StorySnapshot {
        const checksum = StorySnapshot.computeChecksum(data);
        return StorySnapshot.create(storyId, aggregateType, version, data, checksum);
    }

    static verify(snapshot: StorySnapshot): boolean {
        return StorySnapshot.verifyChecksum(snapshot);
    }
}
