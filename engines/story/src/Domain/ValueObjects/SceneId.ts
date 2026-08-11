export class SceneId {
    private readonly value: string;

    private constructor(value: string) {
        this.value = value;
    }

    static create(value: string): SceneId {
        if (!value || value.trim().length === 0) {
            throw new Error("SceneId cannot be empty.");
        }
        const trimmed = value.trim();
        if (!SceneId.UUID_REGEX.test(trimmed)) {
            throw new Error(`SceneId must be a valid UUID: ${trimmed}`);
        }
        return new SceneId(trimmed);
    }

    static generate(): SceneId {
        return new SceneId(crypto.randomUUID());
    }

    getValue(): string {
        return this.value;
    }

    equals(other: SceneId): boolean {
        return this.value === other.value;
    }

    toString(): string {
        return this.value;
    }

    private static readonly UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
}
