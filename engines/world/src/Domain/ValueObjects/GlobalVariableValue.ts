export class GlobalVariableValue {
    private readonly value: unknown;
    private readonly variableType: string;

    private constructor(value: unknown, variableType: string) {
        this.value = value;
        this.variableType = variableType;
    }

    static create(value: unknown, variableType: string): GlobalVariableValue {
        const validTypes = ["string", "number", "boolean", "object", "array"];
        if (!validTypes.includes(variableType)) {
            throw new Error(`Invalid variable type: ${variableType}`);
        }
        return new GlobalVariableValue(value, variableType);
    }

    static string(value: string): GlobalVariableValue {
        return GlobalVariableValue.create(value, "string");
    }

    static number(value: number): GlobalVariableValue {
        return GlobalVariableValue.create(value, "number");
    }

    static boolean(value: boolean): GlobalVariableValue {
        return GlobalVariableValue.create(value, "boolean");
    }

    static object(value: Record<string, unknown>): GlobalVariableValue {
        return GlobalVariableValue.create(value, "object");
    }

    static array(value: unknown[]): GlobalVariableValue {
        return GlobalVariableValue.create(value, "array");
    }

    getValue(): unknown {
        return this.value;
    }

    getType(): string {
        return this.variableType;
    }

    asString(): string {
        if (this.variableType !== "string") {
            throw new Error(`Variable is not a string. Actual type: ${this.variableType}`);
        }
        return this.value as string;
    }

    asNumber(): number {
        if (this.variableType !== "number") {
            throw new Error(`Variable is not a number. Actual type: ${this.variableType}`);
        }
        return this.value as number;
    }

    asBoolean(): boolean {
        if (this.variableType !== "boolean") {
            throw new Error(`Variable is not a boolean. Actual type: ${this.variableType}`);
        }
        return this.value as boolean;
    }

    equals(other: GlobalVariableValue): boolean {
        return this.variableType === other.variableType && JSON.stringify(this.value) === JSON.stringify(other.value);
    }
}
