/**
 * Nova X AI
 * Conversation Engine
 * Domain Value Object: ParticipantId
 */

export class ParticipantId {
    private readonly value: string;

    private constructor(value: string) {
        this.value = value;
    }

    public static create(value: string): ParticipantId {
        if (!value || value.trim().length === 0) {
            throw new Error("ParticipantId cannot be empty.");
        }
        return new ParticipantId(value.trim());
    }

    public static generate(): ParticipantId {
        return new ParticipantId(`part-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`);
    }

    public getValue(): string {
        return this.value;
    }

    public equals(other: ParticipantId): boolean {
        return this.value === other.value;
    }

    public toString(): string {
        return this.value;
    }
}
