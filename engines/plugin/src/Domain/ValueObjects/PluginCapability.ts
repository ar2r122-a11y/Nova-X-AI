export class PluginCapability {
    readonly name: string;
    readonly description: string;
    readonly risk: "low" | "medium" | "high";

    constructor(name: string, description: string, risk: "low" | "medium" | "high") {
        this.name = name;
        this.description = description;
        this.risk = risk;
    }

    static create(name: string, description: string, risk: "low" | "medium" | "high"): PluginCapability {
        if (!name || name.trim().length === 0) {
            throw new Error("PluginCapability name cannot be empty.");
        }
        return new PluginCapability(name.trim(), description, risk);
    }

    equals(other: PluginCapability): boolean {
        return this.name === other.name && this.risk === other.risk;
    }
}
