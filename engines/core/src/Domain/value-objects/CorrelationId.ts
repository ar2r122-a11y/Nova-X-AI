import { randomUUID } from "crypto";

export class CorrelationId {
    public readonly value: string;

    constructor(value?: string) {
        this.value = value ?? randomUUID();

        if (!this.value || this.value.trim().length === 0) {
            throw new Error("CorrelationId cannot be empty.");
        }
    }

    public static create(): CorrelationId {
        return new CorrelationId();
    }

    public static from(value: string): CorrelationId {
        return new CorrelationId(value);
    }

    public equals(other: CorrelationId): boolean {
        return this.value === other.value;
    }

    public toString(): string {
        return this.value;
    }
}