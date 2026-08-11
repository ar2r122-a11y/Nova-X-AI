export type ObjectiveStatus = "pending" | "active" | "completed" | "failed";

export class ObjectiveStatusRef {
    private readonly value: ObjectiveStatus;

    private constructor(value: ObjectiveStatus) {
        this.value = value;
    }

    static create(value: string): ObjectiveStatusRef {
        if (!ObjectiveStatusRef.isValid(value)) {
            throw new Error(`Invalid ObjectiveStatus: ${value}`);
        }
        return new ObjectiveStatusRef(value as ObjectiveStatus);
    }

    static initial(): ObjectiveStatusRef {
        return ObjectiveStatusRef.create("pending");
    }

    static pending(): ObjectiveStatusRef {
        return ObjectiveStatusRef.create("pending");
    }

    static active(): ObjectiveStatusRef {
        return ObjectiveStatusRef.create("active");
    }

    static completed(): ObjectiveStatusRef {
        return ObjectiveStatusRef.create("completed");
    }

    static failed(): ObjectiveStatusRef {
        return ObjectiveStatusRef.create("failed");
    }

    getValue(): ObjectiveStatus {
        return this.value;
    }

    equals(other: ObjectiveStatusRef): boolean {
        return this.value === other.value;
    }

    toString(): string {
        return this.value;
    }

    private static readonly VALUES: ObjectiveStatus[] = ["pending", "active", "completed", "failed"];

    private static isValid(value: string): boolean {
        return ObjectiveStatusRef.VALUES.includes(value as ObjectiveStatus);
    }
}
