
export class ImageId {
    private readonly value: string;

    private constructor(value: string) {
        this.value = value;
    }

    public static create(): ImageId {
        return new ImageId(`img-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`);
    }

    public static fromString(value: string): ImageId {
        if (!value || value.trim().length === 0) {
            throw new Error("ImageId cannot be empty.");
        }
        return new ImageId(value);
    }

    public getValue(): string {
        return this.value;
    }

    public equals(other: ImageId): boolean {
        return this.value === other.value;
    }
}
