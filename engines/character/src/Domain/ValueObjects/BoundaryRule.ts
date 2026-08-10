
export class BoundaryRule {
    private readonly value: string;

    private constructor(value: string) {
        this.value = value;
    }

    public static create(ruleDescription: string): BoundaryRule {
        if (!ruleDescription || ruleDescription.trim().length === 0) {
            throw new Error("BoundaryRule description cannot be empty.");
        }
        return new BoundaryRule(ruleDescription);
    }

    public static fromString(value: string): BoundaryRule {
        return BoundaryRule.create(value);
    }

    public getValue(): string {
        return this.value;
    }

    public equals(other: BoundaryRule): boolean {
        return this.value === other.value;
    }
}
