export class PerformanceTag {
    private readonly value: string;

    private constructor(value: string) {
        this.value = value;
    }

    static create(value: string): PerformanceTag {
        if (!value || value.trim().length === 0) {
            throw new Error("Performance tag cannot be empty.");
        }
        return new PerformanceTag(value.trim().toLowerCase());
    }

    getValue(): string {
        return this.value;
    }
}
