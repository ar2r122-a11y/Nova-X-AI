
export class AssetId {
    private readonly value: string;

    private constructor(value: string) {
        this.value = value;
    }

    public static create(): AssetId {
        return new AssetId(`ast-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`);
    }

    public static fromString(value: string): AssetId {
        if (!value || value.trim().length === 0) {
            throw new Error("AssetId cannot be empty.");
        }
        return new AssetId(value);
    }

    public getValue(): string {
        return this.value;
    }

    public equals(other: AssetId): boolean {
        return this.value === other.value;
    }
}
