export class DiagnosticId {
    private readonly value: string;

    private constructor(value: string) {
        this.value = value;
    }

    public static create(value: string): DiagnosticId {
        if (!value || value.trim().length === 0) {
            throw new Error("DiagnosticId cannot be empty.");
        }
        return new DiagnosticId(value.trim());
    }

    public getValue(): string {
        return this.value;
    }
}
