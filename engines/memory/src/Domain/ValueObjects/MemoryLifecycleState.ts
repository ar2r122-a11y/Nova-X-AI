export enum MemoryLifecycleState {
    ACTIVE = "active",
    CONSOLIDATED = "consolidated",
    DECAYED = "decayed",
    ARCHIVED = "archived",
    FORGOTTEN = "forgotten"
}

export class MemoryLifecycleStateRef {
    private readonly value: MemoryLifecycleState;

    private constructor(value: MemoryLifecycleState) {
        this.value = value;
    }

    static create(value: string): MemoryLifecycleStateRef {
        const normalized = value.toLowerCase();
        if (!Object.values(MemoryLifecycleState).includes(normalized as MemoryLifecycleState)) {
            throw new Error(`Invalid memory lifecycle state: ${value}`);
        }
        return new MemoryLifecycleStateRef(normalized as MemoryLifecycleState);
    }

    static active(): MemoryLifecycleStateRef {
        return new MemoryLifecycleStateRef(MemoryLifecycleState.ACTIVE);
    }

    static consolidated(): MemoryLifecycleStateRef {
        return new MemoryLifecycleStateRef(MemoryLifecycleState.CONSOLIDATED);
    }

    static decayed(): MemoryLifecycleStateRef {
        return new MemoryLifecycleStateRef(MemoryLifecycleState.DECAYED);
    }

    static archived(): MemoryLifecycleStateRef {
        return new MemoryLifecycleStateRef(MemoryLifecycleState.ARCHIVED);
    }

    static forgotten(): MemoryLifecycleStateRef {
        return new MemoryLifecycleStateRef(MemoryLifecycleState.FORGOTTEN);
    }

    getValue(): MemoryLifecycleState {
        return this.value;
    }

    equals(other: MemoryLifecycleStateRef): boolean {
        return this.value === other.value;
    }

    isActive(): boolean {
        return this.value === MemoryLifecycleState.ACTIVE;
    }

    isForgotten(): boolean {
        return this.value === MemoryLifecycleState.FORGOTTEN;
    }

    toString(): string {
        return this.value;
    }
}
