
export class AspectRatio {
    private readonly width: number;
    private readonly height: number;

    private constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
    }

    public static create(width: number, height: number): AspectRatio {
        if (width <= 0 || height <= 0) {
            throw new Error("AspectRatio dimensions must be positive.");
        }
        return new AspectRatio(width, height);
    }

    public static fromString(value: string): AspectRatio {
        const parts = value.split(":");
        if (parts.length !== 2) {
            throw new Error("Invalid AspectRatio format. Expected W:H.");
        }
        const width = parseInt(parts[0], 10);
        const height = parseInt(parts[1], 10);
        return AspectRatio.create(width, height);
    }

    public getWidth(): number {
        return this.width;
    }

    public getHeight(): number {
        return this.height;
    }

    public getRatio(): number {
        return this.width / this.height;
    }

    public equals(other: AspectRatio): boolean {
        return this.width === other.width && this.height === other.height;
    }

    public toString(): string {
        return `${this.width}:${this.height}`;
    }
}
