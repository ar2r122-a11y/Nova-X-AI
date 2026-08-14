export class TransactionId {
    private readonly value: string;

    private constructor(value: string) {
        this.value = value;
    }

    public static create(): TransactionId {
        return new TransactionId(`tx-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`);
    }

    public static fromString(value: string): TransactionId {
        return new TransactionId(value);
    }

    public getValue(): string {
        return this.value;
    }

    public equals(other: TransactionId): boolean {
        return this.value === other.value;
    }
}

export class StorageKey {
    private readonly value: string;

    private constructor(value: string) {
        this.value = value;
    }

    public static create(collection: string, id: string): StorageKey {
        return new StorageKey(`${collection}:${id}`);
    }

    public static fromString(value: string): StorageKey {
        return new StorageKey(value);
    }

    public getValue(): string {
        return this.value;
    }

    public getCollection(): string {
        return this.value.split(":")[0] ?? "";
    }

    public getId(): string {
        return this.value.split(":")[1] ?? "";
    }

    public equals(other: StorageKey): boolean {
        return this.value === other.value;
    }
}

export class SchemaVersion {
    private readonly major: number;
    private readonly minor: number;
    private readonly patch: number;

    private constructor(major: number, minor: number, patch: number) {
        this.major = major;
        this.minor = minor;
        this.patch = patch;
    }

    public static create(major: number, minor: number, patch: number): SchemaVersion {
        return new SchemaVersion(major, minor, patch);
    }

    public static parse(version: string): SchemaVersion {
        const parts = version.split(".").map(Number);
        return new SchemaVersion(parts[0] ?? 0, parts[1] ?? 0, parts[2] ?? 0);
    }

    public toString(): string {
        return `${this.major}.${this.minor}.${this.patch}`;
    }

    public isGreaterThan(other: SchemaVersion): boolean {
        if (this.major !== other.major) return this.major > other.major;
        if (this.minor !== other.minor) return this.minor > other.minor;
        return this.patch > other.patch;
    }
}

export interface VectorClockEntry {
    readonly nodeId: string;
    readonly counter: number;
}

export class VectorClock {
    private readonly entries: Map<string, number>;

    private constructor(entries: Map<string, number>) {
        this.entries = entries;
    }

    public static create(): VectorClock {
        return new VectorClock(new Map());
    }

    public static fromMap(entries: Map<string, number>): VectorClock {
        return new VectorClock(new Map(entries));
    }

    public increment(nodeId: string): VectorClock {
        const next = new Map(this.entries);
        next.set(nodeId, (next.get(nodeId) ?? 0) + 1);
        return new VectorClock(next);
    }

    public merge(other: VectorClock): VectorClock {
        const merged = new Map(this.entries);
        for (const [nodeId, counter] of other.entries) {
            merged.set(nodeId, Math.max(merged.get(nodeId) ?? 0, counter));
        }
        return new VectorClock(merged);
    }

    public compare(other: VectorClock): "before" | "after" | "concurrent" | "equal" {
        let allGreater = false;
        let allLess = false;

        const allKeys = new Set([...this.entries.keys(), ...other.entries.keys()]);
        for (const key of allKeys) {
            const a = this.entries.get(key) ?? 0;
            const b = other.entries.get(key) ?? 0;
            if (a > b) allGreater = true;
            if (a < b) allLess = true;
        }

        if (allGreater && !allLess) return "after";
        if (allLess && !allGreater) return "before";
        if (!allGreater && !allLess) return "equal";
        return "concurrent";
    }

    public getEntries(): VectorClockEntry[] {
        return Array.from(this.entries.entries()).map(([nodeId, counter]) => ({ nodeId, counter }));
    }

    public toJSON(): Record<string, number> {
        return Object.fromEntries(this.entries);
    }
}

export class Checksum {
    private readonly value: string;

    private constructor(value: string) {
        this.value = value;
    }

    public static async create(data: string): Promise<Checksum> {
        const encoded = new TextEncoder().encode(data);
        const hash = await crypto.subtle.digest("SHA-256", encoded);
        const hashArray = Array.from(new Uint8Array(hash));
        const hex = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
        return new Checksum(`sha256-${hex}`);
    }

    public static fromString(value: string): Checksum {
        return new Checksum(value);
    }

    public getValue(): string {
        return this.value;
    }

    public equals(other: Checksum): boolean {
        return this.value === other.value;
    }
}

export class Delta {
    private readonly changes: Map<string, { readonly before: unknown; readonly after: unknown }>;

    private constructor(changes: Map<string, { before: unknown; after: unknown }>) {
        this.changes = changes;
    }

    public static create(): Delta {
        return new Delta(new Map());
    }

    public static fromMap(changes: Map<string, { before: unknown; after: unknown }>): Delta {
        return new Delta(changes);
    }

    public addChange(key: string, before: unknown, after: unknown): Delta {
        const next = new Map(this.changes);
        next.set(key, { before, after });
        return new Delta(next);
    }

    public getChanges(): Map<string, { before: unknown; after: unknown }> {
        return new Map(this.changes);
    }

    public isEmpty(): boolean {
        return this.changes.size === 0;
    }
}
