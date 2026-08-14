export class PluginVersion {
    readonly major: number;
    readonly minor: number;
    readonly patch: number;

    private constructor(major: number, minor: number, patch: number) {
        this.major = major;
        this.minor = minor;
        this.patch = patch;
    }

    static parse(version: string): PluginVersion {
        const parts = version.split(".");
        if (parts.length !== 3) {
            throw new Error(`Invalid plugin version: ${version}`);
        }
        const [major, minor, patch] = parts.map((part) => {
            const num = parseInt(part, 10);
            if (!Number.isInteger(num) || num < 0) {
                throw new Error(`Invalid plugin version: ${version}`);
            }
            return num;
        });
        return new PluginVersion(major, minor, patch);
    }

    static create(major: number, minor: number, patch: number): PluginVersion {
        if (!Number.isInteger(major) || !Number.isInteger(minor) || !Number.isInteger(patch) || major < 0 || minor < 0 || patch < 0) {
            throw new Error("PluginVersion parts must be non-negative integers.");
        }
        return new PluginVersion(major, minor, patch);
    }

    satisfiesSemantic(required: PluginVersion): boolean {
        if (this.major !== required.major) {
            return this.major > required.major;
        }
        if (this.minor !== required.minor) {
            return this.minor > required.minor;
        }
        return this.patch >= required.patch;
    }

    toString(): string {
        return `${this.major}.${this.minor}.${this.patch}`;
    }

    equals(other: PluginVersion): boolean {
        return this.major === other.major && this.minor === other.minor && this.patch === other.patch;
    }
}
