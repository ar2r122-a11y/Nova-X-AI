/**
 * Nova X AI
 * Conversation Engine
 * Domain Value Object: SessionId
 */

export class SessionId {
    private readonly value: string;

    private constructor(value: string) {
        this.value = value;
    }

    public static create(value: string): SessionId {
        if (!value || value.trim().length === 0) {
            throw new Error("SessionId cannot be empty.");
        }
        return new SessionId(value.trim());
    }

    public static generate(): SessionId {
        return new SessionId(`session-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`);
    }

    public getValue(): string {
        return this.value;
    }

    public equals(other: SessionId): boolean {
        return this.value === other.value;
    }

    public toString(): string {
        return this.value;
    }
}
