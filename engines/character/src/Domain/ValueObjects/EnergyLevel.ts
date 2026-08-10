
export class EnergyLevel {
    public readonly value: number;

    private constructor(value: number) {
        this.value = value;
    }

    public static create(value: number): EnergyLevel {
        if (value < 0.0 || value > 1.0) {
            throw new Error("EnergyLevel must be between 0.0 and 1.0.");
        }
        return new EnergyLevel(value);
    }

    public static fromNumber(value: number): EnergyLevel {
        return EnergyLevel.create(value);
    }

    public getValue(): number {
        return this.value;
    }

    public equals(other: EnergyLevel): boolean {
        return this.value === other.value;
    }
}
