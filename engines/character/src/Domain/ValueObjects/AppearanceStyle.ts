
export class AppearanceStyle {
    private readonly value: string;

    private constructor(value: string) {
        this.value = value;
    }

    public static create(style: string): AppearanceStyle {
        if (!style || style.trim().length === 0) {
            throw new Error("AppearanceStyle cannot be empty.");
        }
        return new AppearanceStyle(style);
    }

    public static fromString(value: string): AppearanceStyle {
        return AppearanceStyle.create(value);
    }

    public getValue(): string {
        return this.value;
    }

    public equals(other: AppearanceStyle): boolean {
        return this.value === other.value;
    }
}
