export class WorldEventVersion {
    private readonly value: number;

    private constructor(value: number) {
        this.value = value;
    }

    static create(value: number): WorldEventVersion {
        if (!Number.isInteger(value) || value < 0) {
            throw new Error("WorldEventVersion must be a non-negative integer.");
        }
        return new WorldEventVersion(value);
    }

    static initial(): WorldEventVersion {
        return WorldEventVersion.create(0);
    }

    static next(previous: WorldEventVersion): WorldEventVersion {
        return WorldEventVersion.create(previous.getValue() + 1);
    }

    getValue(): number {
        return this.value;
    }

    equals(other: WorldEventVersion): boolean {
        return this.value === other.value;
    }

    isGreaterThan(other: WorldEventVersion): boolean {
        return this.value > other.value;
    }

    isGreaterThanOrEqual(other: WorldEventVersion): boolean {
        return this.value >= other.value;
    }

    isLessThan(other: WorldEventVersion): boolean {
        return this.value < other.value;
    }

    isLessThanOrEqual(other: WorldEventVersion): boolean {
        return this.value <= other.value;
    }
}
