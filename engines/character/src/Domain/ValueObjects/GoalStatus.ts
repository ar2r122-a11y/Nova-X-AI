
export class GoalStatus {
    public readonly value: string;

    private constructor(value: string) {
        this.value = value;
    }

    public static readonly Pending = new GoalStatus("pending");
    public static readonly Active = new GoalStatus("active");
    public static readonly Completed = new GoalStatus("completed");
    public static readonly Abandoned = new GoalStatus("abandoned");

    public static create(value: string): GoalStatus {
        const validValues = ["pending", "active", "completed", "abandoned"];
        if (!validValues.includes(value)) {
            throw new Error(`Invalid GoalStatus: ${value}`);
        }
        return new GoalStatus(value);
    }

    public getValue(): string {
        return this.value;
    }

    public equals(other: GoalStatus): boolean {
        return this.value === other.value;
    }
}
