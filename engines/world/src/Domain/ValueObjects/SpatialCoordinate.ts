export class SpatialCoordinate {
    private readonly x: number;
    private readonly y: number;
    private readonly z: number;

    private constructor(x: number, y: number, z: number) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    static create(x: number, y: number, z: number): SpatialCoordinate {
        return new SpatialCoordinate(x, y, z);
    }

    static origin(): SpatialCoordinate {
        return new SpatialCoordinate(0, 0, 0);
    }

    getX(): number {
        return this.x;
    }

    getY(): number {
        return this.y;
    }

    getZ(): number {
        return this.z;
    }

    distanceTo(other: SpatialCoordinate): number {
        const dx = this.x - other.x;
        const dy = this.y - other.y;
        const dz = this.z - other.z;
        return Math.sqrt(dx * dx + dy * dy + dz * dz);
    }

    equals(other: SpatialCoordinate): boolean {
        return this.x === other.x && this.y === other.y && this.z === other.z;
    }

    toString(): string {
        return `(${this.x}, ${this.y}, ${this.z})`;
    }
}
