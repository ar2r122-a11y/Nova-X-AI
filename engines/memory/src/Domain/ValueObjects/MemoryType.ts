export enum MemoryType {
    EPISODIC = "episodic",
    SEMANTIC = "semantic",
    WORKING = "working"
}

export class MemoryTypeRef {
    private readonly value: MemoryType;

    private constructor(value: MemoryType) {
        this.value = value;
    }

    static create(value: string): MemoryTypeRef {
        const normalized = value.toLowerCase();
        if (!Object.values(MemoryType).includes(normalized as MemoryType)) {
            throw new Error(`Invalid memory type: ${value}`);
        }
        return new MemoryTypeRef(normalized as MemoryType);
    }

    static episodic(): MemoryTypeRef {
        return new MemoryTypeRef(MemoryType.EPISODIC);
    }

    static semantic(): MemoryTypeRef {
        return new MemoryTypeRef(MemoryType.SEMANTIC);
    }

    static working(): MemoryTypeRef {
        return new MemoryTypeRef(MemoryType.WORKING);
    }

    getValue(): MemoryType {
        return this.value;
    }

    equals(other: MemoryTypeRef): boolean {
        return this.value === other.value;
    }

    toString(): string {
        return this.value;
    }
}
