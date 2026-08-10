import { ISpatialIndex } from "./SpatialIndex";
import { RTreeIndex } from "./RTreeIndex";

export class SpatialIndexManager {
    private readonly indices = new Map<string, ISpatialIndex>();

    rebuild(worldId: string): void {
        this.clear(worldId);
        const index = new RTreeIndex();
        this.indices.set(worldId, index);
    }

    getIndex(worldId: string): ISpatialIndex {
        if (!this.indices.has(worldId)) {
            this.rebuild(worldId);
        }
        return this.indices.get(worldId)!;
    }

    clear(worldId: string): void {
        this.indices.delete(worldId);
    }
}
