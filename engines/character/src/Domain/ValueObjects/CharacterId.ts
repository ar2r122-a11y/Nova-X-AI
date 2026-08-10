
export class CharacterId {
    private readonly value: string;

    private constructor(value: string) {
        this.value = value;
    }

    public static create(): CharacterId {
        return new CharacterId(`char-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`);
    }

    public static fromString(value: string): CharacterId {
        if (!value || value.trim().length === 0) {
            throw new Error("CharacterId cannot be empty.");
        }
        return new CharacterId(value);
    }

    public getValue(): string {
        return this.value;
    }

    public equals(other: CharacterId): boolean {
        return this.value === other.value;
    }
}
