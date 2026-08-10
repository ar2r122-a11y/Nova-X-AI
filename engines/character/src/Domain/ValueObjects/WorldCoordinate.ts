
export class WorldCoordinate {
    private readonly value: string;

    private constructor(value: string) {
        this.value = value;
    }

    public static create(coordinate: string): WorldCoordinate {
        if (!coordinate || coordinate.trim().length === 0) {
            throw new Error("WorldCoordinate cannot be empty.");
        }
        return new WorldCoordinate(coordinate);
    }

    public static fromString(value: string): WorldCoordinate {
        return WorldCoordinate.create(value);
    }

    public getValue(): string {
        return this.value;
    }

    public equals(other: WorldCoordinate): boolean {
        return this.value === other.value;
    }
}
