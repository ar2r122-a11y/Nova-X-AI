export class AudioDuration {
    private readonly value: number;

    private constructor(value: number) {
        this.value = value;
    }

    public static create(milliseconds: number): AudioDuration {
        if (milliseconds < 0) {
            throw new Error("AudioDuration cannot be negative.");
        }
        return new AudioDuration(milliseconds);
    }

    public static zero(): AudioDuration {
        return AudioDuration.create(0);
    }

    public getValue(): number {
        return this.value;
    }

    public getSeconds(): number {
        return this.value / 1000;
    }

    public equals(other: AudioDuration): boolean {
        return this.value === other.value;
    }
}
