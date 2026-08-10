import { SpatialQueryCoordinate, ISpatialIndex } from "./SpatialIndex";

interface Node {
    readonly coordinate: SpatialQueryCoordinate;
    readonly entityId: string;
}

export class RTreeIndex implements ISpatialIndex {
    private readonly nodes: Node[] = [];

    insert(coordinate: SpatialQueryCoordinate, entityId: string): void {
        const existing = this.nodes.find(n => n.coordinate.x === coordinate.x && n.coordinate.y === coordinate.y && n.coordinate.z === coordinate.z && n.entityId === entityId);
        if (existing) {
            return;
        }
        this.nodes.push({ coordinate: { ...coordinate }, entityId });
    }

    remove(coordinate: SpatialQueryCoordinate, entityId: string): void {
        const index = this.nodes.findIndex(n => n.coordinate.x === coordinate.x && n.coordinate.y === coordinate.y && n.coordinate.z === coordinate.z && n.entityId === entityId);
        if (index !== -1) {
            this.nodes.splice(index, 1);
        }
    }

    radiusSearch(center: SpatialQueryCoordinate, radius: number): string[] {
        const results: string[] = [];
        for (const node of this.nodes) {
            const dx = node.coordinate.x - center.x;
            const dy = node.coordinate.y - center.y;
            const dz = node.coordinate.z - center.z;
            const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
            if (distance <= radius) {
                results.push(node.entityId);
            }
        }
        return results;
    }

    contains(coordinate: SpatialQueryCoordinate): boolean {
        return this.nodes.some(n => n.coordinate.x === coordinate.x && n.coordinate.y === coordinate.y && n.coordinate.z === coordinate.z);
    }
}
