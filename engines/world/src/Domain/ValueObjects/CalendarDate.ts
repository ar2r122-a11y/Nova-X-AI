export class CalendarDate {
    private readonly year: number;
    private readonly month: number;
    private readonly day: number;

    private constructor(year: number, month: number, day: number) {
        this.year = year;
        this.month = month;
        this.day = day;
    }

    static create(year: number, month: number, day: number): CalendarDate {
        if (year < 1) {
            throw new Error("Year must be a positive integer.");
        }
        if (month < 1 || month > 12) {
            throw new Error("Month must be between 1 and 12.");
        }
        const daysInMonth = new Date(year, month, 0).getDate();
        if (day < 1 || day > daysInMonth) {
            throw new Error(`Day must be between 1 and ${daysInMonth} for the given month.`);
        }
        return new CalendarDate(year, month, day);
    }

    static fromTimestamp(timestamp: number): CalendarDate {
        const date = new Date(timestamp);
        return CalendarDate.create(date.getFullYear(), date.getMonth() + 1, date.getDate());
    }

    static today(): CalendarDate {
        const now = new Date();
        return CalendarDate.create(now.getFullYear(), now.getMonth() + 1, now.getDate());
    }

    getYear(): number {
        return this.year;
    }

    getMonth(): number {
        return this.month;
    }

    getDay(): number {
        return this.day;
    }

    addDays(days: number): CalendarDate {
        const current = new Date(this.year, this.month - 1, this.day);
        current.setDate(current.getDate() + days);
        return CalendarDate.create(current.getFullYear(), current.getMonth() + 1, current.getDate());
    }

    daysUntil(other: CalendarDate): number {
        const a = new Date(this.year, this.month - 1, this.day);
        const b = new Date(other.year, other.month - 1, other.day);
        return Math.round((b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24));
    }

    equals(other: CalendarDate): boolean {
        return this.year === other.year && this.month === other.month && this.day === other.day;
    }

    toString(): string {
        const m = String(this.month).padStart(2, "0");
        const d = String(this.day).padStart(2, "0");
        return `${this.year}-${m}-${d}`;
    }
}
