/**
 * Nova X AI
 * Conversation Engine
 * Domain Value Object: LanguageCode
 */

export class LanguageCode {
    private readonly value: string;

    private constructor(value: string) {
        this.value = value;
    }

    public static create(value: string): LanguageCode {
        const trimmed = value.trim().toLowerCase();
        if (trimmed.length === 0) {
            throw new Error("LanguageCode cannot be empty.");
        }
        return new LanguageCode(trimmed);
    }

    public static auto(): LanguageCode {
        return new LanguageCode("auto");
    }

    public static english(): LanguageCode {
        return new LanguageCode("en");
    }

    public static arabic(): LanguageCode {
        return new LanguageCode("ar");
    }

    public static mixed(): LanguageCode {
        return new LanguageCode("mixed");
    }

    public getValue(): string {
        return this.value;
    }

    public equals(other: LanguageCode): boolean {
        return this.value === other.value;
    }

    public isAutoDetect(): boolean {
        return this.value === "auto";
    }

    public toString(): string {
        return this.value;
    }
}
