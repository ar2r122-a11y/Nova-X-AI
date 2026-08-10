
export class KnowledgeArea {
    private readonly value: string;

    private constructor(value: string) {
        this.value = value;
    }

    public static create(area: string): KnowledgeArea {
        if (!area || area.trim().length === 0) {
            throw new Error("KnowledgeArea cannot be empty.");
        }
        return new KnowledgeArea(area);
    }

    public static fromString(value: string): KnowledgeArea {
        return KnowledgeArea.create(value);
    }

    public getValue(): string {
        return this.value;
    }

    public equals(other: KnowledgeArea): boolean {
        return this.value === other.value;
    }
}
