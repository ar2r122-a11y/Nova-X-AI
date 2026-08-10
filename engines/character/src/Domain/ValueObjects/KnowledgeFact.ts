
export class KnowledgeFact {
    private readonly value: string;

    private constructor(value: string) {
        this.value = value;
    }

    public static create(factKey: string): KnowledgeFact {
        if (!factKey || factKey.trim().length === 0) {
            throw new Error("KnowledgeFact key cannot be empty.");
        }
        return new KnowledgeFact(factKey);
    }

    public static fromString(value: string): KnowledgeFact {
        return KnowledgeFact.create(value);
    }

    public getValue(): string {
        return this.value;
    }

    public equals(other: KnowledgeFact): boolean {
        return this.value === other.value;
    }
}
