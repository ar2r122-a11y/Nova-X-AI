
export class ToolAccessLevel {
    public readonly value: string;

    private constructor(value: string) {
        this.value = value;
    }

    public static readonly None = new ToolAccessLevel("none");
    public static readonly Read = new ToolAccessLevel("read");
    public static readonly Write = new ToolAccessLevel("write");
    public static readonly Admin = new ToolAccessLevel("admin");
    public static readonly User = new ToolAccessLevel("user");

    public static create(value: string): ToolAccessLevel {
        const validValues = ["none", "read", "write", "admin", "user"];
        if (!validValues.includes(value)) {
            throw new Error(`Invalid ToolAccessLevel: ${value}`);
        }
        return new ToolAccessLevel(value);
    }

    public getValue(): string {
        return this.value;
    }

    public equals(other: ToolAccessLevel): boolean {
        return this.value === other.value;
    }
}
