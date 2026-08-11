export class StoryVersion {
    private readonly value: number;

    private constructor(value: number) {
        this.value = value;
    }

    static create(value: number): StoryVersion {
        if (!Number.isInteger(value) || value < 0) {
            throw new Error("StoryVersion must be a non-negative integer.");
        }
        return new StoryVersion(value);
    }

    static initial(): StoryVersion {
        return StoryVersion.create(0);
    }

    static next(previous: StoryVersion): StoryVersion {
        return StoryVersion.create(previous.getValue() + 1);
    }

    getValue(): number {
        return this.value;
    }

    equals(other: StoryVersion): boolean {
        return this.value === other.value;
    }

    isGreaterThan(other: StoryVersion): boolean {
        return this.value > other.value;
    }

    isGreaterThanOrEqual(other: StoryVersion): boolean {
        return this.value >= other.value;
    }

    isLessThan(other: StoryVersion): boolean {
        return this.value < other.value;
    }

    isLessThanOrEqual(other: StoryVersion): boolean {
        return this.value <= other.value;
    }
}
