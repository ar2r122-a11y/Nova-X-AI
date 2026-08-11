export type StoryStatus = "draft" | "active" | "paused" | "completed" | "failed" | "archived";

export class StoryStatusRef {
    private readonly value: StoryStatus;

    private constructor(value: StoryStatus) {
        this.value = value;
    }

    static create(value: string): StoryStatusRef {
        if (!StoryStatusRef.isValid(value)) {
            throw new Error(`Invalid StoryStatus: ${value}`);
        }
        return new StoryStatusRef(value as StoryStatus);
    }

    static initial(): StoryStatusRef {
        return StoryStatusRef.create("draft");
    }

    static draft(): StoryStatusRef {
        return StoryStatusRef.create("draft");
    }

    static active(): StoryStatusRef {
        return StoryStatusRef.create("active");
    }

    static paused(): StoryStatusRef {
        return StoryStatusRef.create("paused");
    }

    static completed(): StoryStatusRef {
        return StoryStatusRef.create("completed");
    }

    static failed(): StoryStatusRef {
        return StoryStatusRef.create("failed");
    }

    static archived(): StoryStatusRef {
        return StoryStatusRef.create("archived");
    }

    getValue(): StoryStatus {
        return this.value;
    }

    equals(other: StoryStatusRef): boolean {
        return this.value === other.value;
    }

    toString(): string {
        return this.value;
    }

    private static readonly VALUES: StoryStatus[] = ["draft", "active", "paused", "completed", "failed", "archived"];

    private static isValid(value: string): boolean {
        return StoryStatusRef.VALUES.includes(value as StoryStatus);
    }
}
