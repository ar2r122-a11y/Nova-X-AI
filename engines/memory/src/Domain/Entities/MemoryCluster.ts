import { MemoryClusterId } from "../ValueObjects/MemoryClusterId";
import { MemoryId } from "../ValueObjects/MemoryId";
import { VectorMetadata } from "../ValueObjects/VectorMetadata";

export interface MemoryClusterProps {
    id: MemoryClusterId;
    centroidVector: VectorMetadata;
    memberMemoryIds: MemoryId[];
    createdAt: number;
    updatedAt: number;
    memberCount: number;
}

export class MemoryCluster {
    private readonly props: MemoryClusterProps;

    private constructor(props: MemoryClusterProps) {
        this.props = props;
    }

    static create(props: Omit<MemoryClusterProps, "id" | "createdAt" | "updatedAt" | "memberCount">): MemoryCluster {
        const now = Date.now();
        return new MemoryCluster({
            ...props,
            id: MemoryClusterId.generate(),
            createdAt: now,
            updatedAt: now,
            memberCount: props.memberMemoryIds.length
        });
    }

    static reconstitute(props: MemoryClusterProps): MemoryCluster {
        return new MemoryCluster(props);
    }

    getId(): MemoryClusterId {
        return this.props.id;
    }

    getCentroidVector(): VectorMetadata {
        return this.props.centroidVector;
    }

    getMemberMemoryIds(): MemoryId[] {
        return this.props.memberMemoryIds;
    }

    getCreatedAt(): number {
        return this.props.createdAt;
    }

    getUpdatedAt(): number {
        return this.props.updatedAt;
    }

    getMemberCount(): number {
        return this.props.memberCount;
    }

    addMember(memoryId: MemoryId): void {
        if (!this.props.memberMemoryIds.some((id) => id.equals(memoryId))) {
            this.props.memberMemoryIds.push(memoryId);
            this.props.memberCount = this.props.memberMemoryIds.length;
            this.props.updatedAt = Date.now();
        }
    }

    removeMember(memoryId: MemoryId): void {
        this.props.memberMemoryIds = this.props.memberMemoryIds.filter((id) => !id.equals(memoryId));
        this.props.memberCount = this.props.memberMemoryIds.length;
        this.props.updatedAt = Date.now();
    }
}
