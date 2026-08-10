export class GlobalVariableKey {
    private readonly value: string;

    private constructor(value: string) {
        this.value = value;
    }

    static create(value: string): GlobalVariableKey {
        if (!value || value.trim().length === 0) {
            throw new Error("GlobalVariableKey cannot be empty.");
        }
        if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(value)) {
            throw new Error("GlobalVariableKey must be a valid identifier.");
        }
        return new GlobalVariableKey(value);
    }

    getValue(): string {
        return this.value;
    }

    equals(other: GlobalVariableKey): boolean {
        return this.value === other.value;
    }
}
