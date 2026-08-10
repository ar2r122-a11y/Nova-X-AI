import { TimeOfDay } from "../../Domain/ValueObjects/TimeOfDay";
import { CalendarDate } from "../../Domain/ValueObjects/CalendarDate";
import { SeasonRef } from "../../Domain/ValueObjects/Season";

export class WorldClockQueryResultDto {
    constructor(
        public readonly currentTime: string,
        public readonly currentDate: string,
        public readonly currentSeason: string,
        public readonly tickCount: number
    ) {}

    static fromClock(clock: {
        getTimeOfDay(): TimeOfDay;
        getCalendarDate(): CalendarDate;
        getSeason(): SeasonRef;
        getTickCount(): number;
    }): WorldClockQueryResultDto {
        return new WorldClockQueryResultDto(
            clock.getTimeOfDay().toString(),
            clock.getCalendarDate().toString(),
            clock.getSeason().getValue(),
            clock.getTickCount()
        );
    }
}
