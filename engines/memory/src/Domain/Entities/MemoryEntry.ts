import { MemoryId } from "../ValueObjects/MemoryId";
import { MemoryTypeRef } from "../ValueObjects/MemoryType";
import { MemorySalience } from "../ValueObjects/MemorySalience";
import { MemoryClusterId } from "../ValueObjects/MemoryClusterId";
import { ContentHash } from "../ValueObjects/ContentHash";
import { MemoryLifecycleStateRef } from "../ValueObjects/MemoryLifecycleState";
import { VectorMetadata } from "../ValueObjects/VectorMetadata";

export interface MemoryEntryProps {
    id: MemoryId;
    type: MemoryTypeRef;
    content: string;
    salience: MemorySalience;
    contentHash: ContentHash;
    ownerId: string;
    clusterId?: MemoryClusterId;
    vectorMetadata?: VectorMetadata;
    createdAt: number;
    updatedAt: number;
    lastAccessedAt: number;
    accessCount: number;
    decayRate: number;
    state: MemoryLifecycleStateRef;
    tags: string[];
    sourceEventId?: string;
}

export class MemoryEntry {
    private readonly props: MemoryEntryProps;

    private constructor(props: MemoryEntryProps) {
        this.props = props;
    }

    static create(props: Omit<MemoryEntryProps, "id" | "createdAt" | "updatedAt" | "lastAccessedAt" | "accessCount" | "state">): MemoryEntry {
        const now = Date.now();
        return new MemoryEntry({
            ...props,
            id: MemoryId.generate(),
            createdAt: now,
            updatedAt: now,
            lastAccessedAt: now,
            accessCount: 0,
            state: MemoryLifecycleStateRef.active()
        });
    }

    static reconstitute(props: MemoryEntryProps): MemoryEntry {
        return new MemoryEntry(props);
    }

    getId(): MemoryId {
        return this.props.id;
    }

    getType(): MemoryTypeRef {
        return this.props.type;
    }

    getContent(): string {
        return this.props.content;
    }

    getSalience(): MemorySalience {
        return this.props.salience;
    }

    getContentHash(): ContentHash {
        return this.props.contentHash;
    }

    getOwnerId(): string {
        return this.props.ownerId;
    }

    getClusterId(): MemoryClusterId | undefined {
        return this.props.clusterId;
    }

    getVectorMetadata(): VectorMetadata | undefined {
        return this.props.vectorMetadata;
    }

    getCreatedAt(): number {
        return this.props.createdAt;
    }

    getUpdatedAt(): number {
        return this.props.updatedAt;
    }

    getLastAccessedAt(): number {
        return this.props.lastAccessedAt;
    }

    getAccessCount(): number {
        return this.props.accessCount;
    }

    getDecayRate(): number {
        return this.props.decayRate;
    }

    getState(): MemoryLifecycleStateRef {
        return this.props.state;
    }

    getTags(): string[] {
        return this.props.tags;
    }

    getSourceEventId(): string | undefined {
        return this.props.sourceEventId;
    }

    access(): void {
        this.props.lastAccessedAt = Date.now();
        this.props.accessCount += 1;
    }

    updateSalience(salience: MemorySalience): void {
        this.props.salience = salience;
        this.props.updatedAt = Date.now();
    }

    updateContent(content: string): void {
        this.props.content = content;
        this.props.contentHash = ContentHash.compute(content);
        this.props.updatedAt = Date.now();
    }

    decaySalience(rate: number): void {
        this.props.salience = this.props.salience.decay(rate);
        this.props.updatedAt = Date.now();
    }

    consolidate(clusterId: MemoryClusterId): void {
        this.props.clusterId = clusterId;
        this.props.state = MemoryLifecycleStateRef.consolidated();
        this.props.updatedAt = Date.now();
    }

    archive(): void {
        this.props.state = MemoryLifecycleStateRef.archived();
        this.props.updatedAt = Date.now();
    }

    forget(): void {
        this.props.state = MemoryLifecycleStateRef.forgotten();
        this.props.updatedAt = Date.now();
    }

    toSnapshot(): MemoryEntryProps {
        return { ...this.props };
    }
}
