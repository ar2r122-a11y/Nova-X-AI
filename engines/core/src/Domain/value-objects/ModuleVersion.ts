export class ModuleVersion {
    public readonly major: number;
    public readonly minor: number;
    public readonly patch: number;

    constructor(
        major: number,
        minor: number,
        patch: number
    ) {
        if (major < 0 || minor < 0 || patch < 0) {
            throw new Error("Version numbers cannot be negative.");
        }

        this.major = major;
        this.minor = minor;
        this.patch = patch;
    }

    public static parse(version: string): ModuleVersion {
        const parts = version.split(".").map(Number);

        if (
            parts.length !== 3 ||
            parts.some((n) => Number.isNaN(n))
        ) {
            throw new Error("Invalid semantic version.");
        }

        return new ModuleVersion(parts[0], parts[1], parts[2]);
    }

    public equals(other: ModuleVersion): boolean {
        return (
            this.major === other.major &&
            this.minor === other.minor &&
            this.patch === other.patch
        );
    }

    public toString(): string {
        return `${this.major}.${this.minor}.${this.patch}`;
    }
}