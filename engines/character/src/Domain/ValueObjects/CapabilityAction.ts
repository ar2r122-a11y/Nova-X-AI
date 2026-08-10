
export class CapabilityAction {
    private readonly value: string;

    private constructor(value: string) {
        this.value = value;
    }

    public static create(actionName: string): CapabilityAction {
        if (!actionName || actionName.trim().length === 0) {
            throw new Error("CapabilityAction cannot be empty.");
        }
        return new CapabilityAction(actionName);
    }

    public static fromString(value: string): CapabilityAction {
        return CapabilityAction.create(value);
    }

    public getValue(): string {
        return this.value;
    }

    public equals(other: CapabilityAction): boolean {
        return this.value === other.value;
    }
}
