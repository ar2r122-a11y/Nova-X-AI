
export class EmotionalStateRef {
    private readonly value: string;

    private constructor(value: string) {
        this.value = value;
    }

    public static create(emotionName: string): EmotionalStateRef {
        if (!emotionName || emotionName.trim().length === 0) {
            throw new Error("EmotionalStateRef cannot be empty.");
        }
        return new EmotionalStateRef(emotionName);
    }

    public static fromString(value: string): EmotionalStateRef {
        return EmotionalStateRef.create(value);
    }

    public getValue(): string {
        return this.value;
    }

    public equals(other: EmotionalStateRef): boolean {
        return this.value === other.value;
    }
}
