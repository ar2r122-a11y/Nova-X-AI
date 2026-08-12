
export class ImageStatus {
    private readonly value: string;

    private constructor(value: string) {
        this.value = value;
    }

    public static create(value: string): ImageStatus {
        const valid = ["draft", "queued", "rendering", "completed", "failed", "cancelled"];
        if (!valid.includes(value)) {
            throw new Error(`Invalid ImageStatus: ${value}. Must be one of ${valid.join(", ")}.`);
        }
        return new ImageStatus(value);
    }

    public getValue(): string {
        return this.value;
    }

    public equals(other: ImageStatus): boolean {
        return this.value === other.value;
    }
}
