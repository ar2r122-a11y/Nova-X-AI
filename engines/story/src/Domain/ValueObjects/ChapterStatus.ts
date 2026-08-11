export type ChapterStatus = "locked" | "available" | "active" | "completed";

export class ChapterStatusRef {
    private readonly value: ChapterStatus;

    private constructor(value: ChapterStatus) {
        this.value = value;
    }

    static create(value: string): ChapterStatusRef {
        if (!ChapterStatusRef.isValid(value)) {
            throw new Error(`Invalid ChapterStatus: ${value}`);
        }
        return new ChapterStatusRef(value as ChapterStatus);
    }

    static initial(): ChapterStatusRef {
        return ChapterStatusRef.create("locked");
    }

    static locked(): ChapterStatusRef {
        return ChapterStatusRef.create("locked");
    }

    static available(): ChapterStatusRef {
        return ChapterStatusRef.create("available");
    }

    static active(): ChapterStatusRef {
        return ChapterStatusRef.create("active");
    }

    static completed(): ChapterStatusRef {
        return ChapterStatusRef.create("completed");
    }

    getValue(): ChapterStatus {
        return this.value;
    }

    equals(other: ChapterStatusRef): boolean {
        return this.value === other.value;
    }

    toString(): string {
        return this.value;
    }

    private static readonly VALUES: ChapterStatus[] = ["locked", "available", "active", "completed"];

    private static isValid(value: string): boolean {
        return ChapterStatusRef.VALUES.includes(value as ChapterStatus);
    }
}
