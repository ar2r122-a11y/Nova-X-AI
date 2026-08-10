import { MemoryId } from "../ValueObjects/MemoryId";
import { VectorMetadata } from "../ValueObjects/VectorMetadata";

export interface MemoryTraceProps {
    id: string;
    sourceMemoryId: MemoryId;
    queryVector: VectorMetadata;
    matchedMemoryId: MemoryId;
    similarityScore: number;
    retrievedAt: number;
    contextUsed: string;
}

export class MemoryTrace {
    private readonly props: MemoryTraceProps;

    private constructor(props: MemoryTraceProps) {
        this.props = props;
    }

    static create(props: Omit<MemoryTraceProps, "id" | "retrievedAt">): MemoryTrace {
        return new MemoryTrace({
            ...props,
            id: `trace-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
            retrievedAt: Date.now()
        });
    }

    getId(): string {
        return this.props.id;
    }

    getSourceMemoryId(): MemoryId {
        return this.props.sourceMemoryId;
    }

    getQueryVector(): VectorMetadata {
        return this.props.queryVector;
    }

    getMatchedMemoryId(): MemoryId {
        return this.props.matchedMemoryId;
    }

    getSimilarityScore(): number {
        return this.props.similarityScore;
    }

    getRetrievedAt(): number {
        return this.props.retrievedAt;
    }

    getContextUsed(): string {
        return this.props.contextUsed;
    }
}
