export class TimeOfDay {
    private readonly hours: number;
    private readonly minutes: number;
    private readonly seconds: number;

    private constructor(hours: number, minutes: number, seconds: number) {
        this.hours = hours;
        this.minutes = minutes;
        this.seconds = seconds;
    }

    static create(hours: number, minutes: number, seconds: number): TimeOfDay {
        if (hours < 0 || hours > 23) {
            throw new Error("Hours must be between 0 and 23.");
        }
        if (minutes < 0 || minutes > 59) {
            throw new Error("Minutes must be between 0 and 59.");
        }
        if (seconds < 0 || seconds > 59) {
            throw new Error("Seconds must be between 0 and 59.");
        }
        return new TimeOfDay(hours, minutes, seconds);
    }

    static fromTotalSeconds(totalSeconds: number): TimeOfDay {
        const normalizedSeconds = ((totalSeconds % 86400) + 86400) % 86400;
        const hours = Math.floor(normalizedSeconds / 3600);
        const minutes = Math.floor((normalizedSeconds % 3600) / 60);
        const seconds = normalizedSeconds % 60;
        return new TimeOfDay(hours, minutes, seconds);
    }

    static midnight(): TimeOfDay {
        return new TimeOfDay(0, 0, 0);
    }

    static noon(): TimeOfDay {
        return new TimeOfDay(12, 0, 0);
    }

    getHours(): number {
        return this.hours;
    }

    getMinutes(): number {
        return this.minutes;
    }

    getSeconds(): number {
        return this.seconds;
    }

    getTotalSeconds(): number {
        return this.hours * 3600 + this.minutes * 60 + this.seconds;
    }

    addSeconds(seconds: number): TimeOfDay {
        return TimeOfDay.fromTotalSeconds(this.getTotalSeconds() + seconds);
    }

    equals(other: TimeOfDay): boolean {
        return this.hours === other.hours && this.minutes === other.minutes && this.seconds === other.seconds;
    }

    toString(): string {
        const h = String(this.hours).padStart(2, "0");
        const m = String(this.minutes).padStart(2, "0");
        const s = String(this.seconds).padStart(2, "0");
        return `${h}:${m}:${s}`;
    }
}
