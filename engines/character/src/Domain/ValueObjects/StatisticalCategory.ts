
export class StatisticalCategory {
    private readonly value: string;

    private constructor(value: string) {
        this.value = value;
    }

    public static create(statName: string): StatisticalCategory {
        if (!statName || statName.trim().length === 0) {
            throw new Error("StatisticalCategory cannot be empty.");
        }
        return new StatisticalCategory(statName);
    }

    public static fromString(value: string): StatisticalCategory {
        return StatisticalCategory.create(value);
    }

    public getValue(): string {
        return this.value;
    }

    public equals(other: StatisticalCategory): boolean {
        return this.value === other.value;
    }
}
