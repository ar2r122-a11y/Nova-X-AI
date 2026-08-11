export type ObjectiveType = "required" | "optional" | "hidden";

export class ObjectiveTypeRef {
    private readonly value: ObjectiveType;

    private constructor(value: ObjectiveType) {
        this.value = value;
    }

    static create(value: string): ObjectiveTypeRef {
        if (!ObjectiveTypeRef.isValid(value)) {
            throw new Error(`Invalid ObjectiveType: ${value}`);
        }
        return new ObjectiveTypeRef(value as ObjectiveType);
    }

    static initial(): ObjectiveTypeRef {
        return ObjectiveTypeRef.create("optional");
    }

    static required(): ObjectiveTypeRef {
        return ObjectiveTypeRef.create("required");
    }

    static optional(): ObjectiveTypeRef {
        return ObjectiveTypeRef.create("optional");
    }

    static hidden(): ObjectiveTypeRef {
        return ObjectiveTypeRef.create("hidden");
    }

    getValue(): ObjectiveType {
        return this.value;
    }

    equals(other: ObjectiveTypeRef): boolean {
        return this.value === other.value;
    }

    toString(): string {
        return this.value;
    }

    private static readonly VALUES: ObjectiveType[] = ["required", "optional", "hidden"];

    private static isValid(value: string): boolean {
        return ObjectiveTypeRef.VALUES.includes(value as ObjectiveType);
    }
}
