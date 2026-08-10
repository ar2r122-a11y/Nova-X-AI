export type Season = "spring" | "summer" | "autumn" | "winter";

export class SeasonRef {
    private readonly value: Season;

    private constructor(value: Season) {
        this.value = value;
    }

    static create(value: Season): SeasonRef {
        const validSeasons: Season[] = ["spring", "summer", "autumn", "winter"];
        if (!validSeasons.includes(value)) {
            throw new Error(`Invalid Season: ${value}`);
        }
        return new SeasonRef(value);
    }

    static fromCalendarDate(date: import("./CalendarDate").CalendarDate, northernHemisphere: boolean = true): SeasonRef {
        const month = date.getMonth();
        if (northernHemisphere) {
            if (month >= 3 && month <= 5) return SeasonRef.create("spring");
            if (month >= 6 && month <= 8) return SeasonRef.create("summer");
            if (month >= 9 && month <= 11) return SeasonRef.create("autumn");
            return SeasonRef.create("winter");
        }
        if (month >= 3 && month <= 5) return SeasonRef.create("autumn");
        if (month >= 6 && month <= 8) return SeasonRef.create("winter");
        if (month >= 9 && month <= 11) return SeasonRef.create("spring");
        return SeasonRef.create("summer");
    }

    static spring(): SeasonRef {
        return SeasonRef.create("spring");
    }

    static summer(): SeasonRef {
        return SeasonRef.create("summer");
    }

    static autumn(): SeasonRef {
        return SeasonRef.create("autumn");
    }

    static winter(): SeasonRef {
        return SeasonRef.create("winter");
    }

    getValue(): Season {
        return this.value;
    }

    equals(other: SeasonRef): boolean {
        return this.value === other.value;
    }

    toString(): string {
        return this.value;
    }
}
