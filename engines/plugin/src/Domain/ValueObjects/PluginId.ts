export class PluginId {
    private readonly value: string;

    private constructor(value: string) {
        this.value = value;
    }

    static create(name: string): PluginId {
        if (!name || name.trim().length === 0) {
            throw new Error("PluginId cannot be empty.");
        }
        return new PluginId(name.trim());
    }

    static generate(): PluginId {
        return new PluginId(`plugin-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`);
    }

    get id(): string {
        return this.value;
    }

    equals(other: PluginId): boolean {
        return this.value === other.value;
    }

    toString(): string {
        return this.value;
    }
}
