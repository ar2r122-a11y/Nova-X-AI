
export class CharacterStatus {
    public readonly value: string;

    private constructor(value: string) {
        this.value = value;
    }

    public static readonly Active = new CharacterStatus("active");
    public static readonly Sleeping = new CharacterStatus("sleeping");
    public static readonly Incapacitated = new CharacterStatus("incapacitated");
    public static readonly Traveling = new CharacterStatus("traveling");
    public static readonly Hibernating = new CharacterStatus("hibernating");
    public static readonly Unloaded = new CharacterStatus("unloaded");
    public static readonly Initializing = new CharacterStatus("initializing");

    public static create(value: string): CharacterStatus {
        const validValues = ["active", "sleeping", "incapacitated", "traveling", "hibernating", "unloaded", "initializing"];
        if (!validValues.includes(value)) {
            throw new Error(`Invalid CharacterStatus: ${value}`);
        }
        return new CharacterStatus(value);
    }

    public getValue(): string {
        return this.value;
    }

    public equals(other: CharacterStatus): boolean {
        return this.value === other.value;
    }
}
