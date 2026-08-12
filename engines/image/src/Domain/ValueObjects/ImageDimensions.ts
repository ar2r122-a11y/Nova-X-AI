
export class ImageDimensions {
    private readonly width: number;
    private readonly height: number;

    private constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
    }

    public static create(width: number, height: number): ImageDimensions {
        if (width <= 0 || height <= 0) {
            throw new Error("Dimensions must be positive integers.");
        }
        if (!Number.isInteger(width) || !Number.isInteger(height)) {
            throw new Error("Dimensions must be integers.");
        }
        return new ImageDimensions(width, height);
    }

    public static fromString(dim: string): ImageDimensions {
        const parts = dim.split("x");
        if (parts.length !== 2) {
            throw new Error("Invalid dimension format. Expected WxH.");
        }
        const width = parseInt(parts[0], 10);
        const height = parseInt(parts[1], 10);
        return ImageDimensions.create(width, height);
    }

    public getWidth(): number {
        return this.width;
    }

    public getHeight(): number {
        return this.height;
    }

    public getAspectRatio(): number {
        return this.width / this.height;
    }

    public equals(other: ImageDimensions): boolean {
        return this.width === other.width && this.height === other.height;
    }

    public toString(): string {
        return `${this.width}x${this.height}`;
    }
}
