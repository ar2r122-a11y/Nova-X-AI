
export class RenderId {
    private readonly value: string;

    private constructor(value: string) {
        this.value = value;
    }

    public static create(): RenderId {
        return new RenderId(`ren-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`);
    }

    public static fromString(value: string): RenderId {
        if (!value || value.trim().length === 0) {
            throw new Error("RenderId cannot be empty.");
        }
        return new RenderId(value);
    }

    public getValue(): string {
        return this.value;
    }

    public equals(other: RenderId): boolean {
        return this.value === other.value;
    }
}
