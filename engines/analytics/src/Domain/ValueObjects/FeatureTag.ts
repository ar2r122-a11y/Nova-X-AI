export class FeatureTag {
    private readonly value: string;

    private constructor(value: string) {
        this.value = value;
    }

    static create(value: string): FeatureTag {
        if (!value || value.trim().length === 0) {
            throw new Error("Feature tag cannot be empty.");
        }
        return new FeatureTag(value.trim().toLowerCase());
    }

    getValue(): string {
        return this.value;
    }
}
