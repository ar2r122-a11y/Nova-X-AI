export class WorldId {
    private readonly value: string;

    private constructor(value: string) {
        this.value = value;
    }

    static create(value: string): WorldId {
        if (!value || value.trim().length === 0) {
            throw new Error("WorldId cannot be empty.");
        }
        return new WorldId(value);
    }

    static fromString(value: string): WorldId {
        return WorldId.create(value);
    }

    getValue(): string {
        return this.value;
    }

    equals(other: WorldId): boolean {
        return this.value === other.value;
    }
}
