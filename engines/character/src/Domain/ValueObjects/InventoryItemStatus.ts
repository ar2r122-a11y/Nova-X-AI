
export class InventoryItemStatus {
    public readonly value: string;

    private constructor(value: string) {
        this.value = value;
    }

    public static readonly Equipped = new InventoryItemStatus("equipped");
    public static readonly Carried = new InventoryItemStatus("carried");
    public static readonly Stored = new InventoryItemStatus("stored");

    public static create(value: string): InventoryItemStatus {
        const validValues = ["equipped", "carried", "stored"];
        if (!validValues.includes(value)) {
            throw new Error(`Invalid InventoryItemStatus: ${value}`);
        }
        return new InventoryItemStatus(value);
    }

    public getValue(): string {
        return this.value;
    }

    public equals(other: InventoryItemStatus): boolean {
        return this.value === other.value;
    }
}
