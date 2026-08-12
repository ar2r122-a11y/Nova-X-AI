
export class ModelIdentifier {
    private readonly value: string;

    private constructor(value: string) {
        this.value = value;
    }

    public static create(modelName: string, version?: string): ModelIdentifier {
        const normalized = version ? `${modelName}:${version}` : modelName;
        if (!normalized || normalized.trim().length === 0) {
            throw new Error("ModelIdentifier cannot be empty.");
        }
        return new ModelIdentifier(normalized);
    }

    public static fromString(value: string): ModelIdentifier {
        if (!value || value.trim().length === 0) {
            throw new Error("ModelIdentifier cannot be empty.");
        }
        return new ModelIdentifier(value);
    }

    public getValue(): string {
        return this.value;
    }

    public getModelName(): string {
        const parts = this.value.split(":");
        return parts[0];
    }

    public getVersion(): string | undefined {
        const parts = this.value.split(":");
        return parts.length > 1 ? parts.slice(1).join(":") : undefined;
    }

    public equals(other: ModelIdentifier): boolean {
        return this.value === other.value;
    }
}
