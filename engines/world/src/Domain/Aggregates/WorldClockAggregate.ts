import { IDomainEvent } from "@nova-x-ai/core";
import { WorldId } from "../ValueObjects/WorldId";
import { TimeOfDay } from "../ValueObjects/TimeOfDay";
import { CalendarDate } from "../ValueObjects/CalendarDate";
import { SeasonRef } from "../ValueObjects/Season";
import { WorldEventVersion } from "../ValueObjects/WorldEventVersion";
import { WorldHistoryEntry } from "../Entities/WorldHistoryEntry";
import { TimeAdvancedEvent } from "../Events";

export class WorldClockAggregate {
    private readonly worldId: WorldId;
    private timeOfDay: TimeOfDay;
    private calendarDate: CalendarDate;
    private season: SeasonRef;
    private tickCount: number;
    private readonly uncommittedEvents: IDomainEvent[];
    private version: WorldEventVersion;

    private constructor(
        worldId: WorldId,
        timeOfDay: TimeOfDay,
        calendarDate: CalendarDate,
        season: SeasonRef,
        tickCount: number,
        version: WorldEventVersion
    ) {
        this.worldId = worldId;
        this.timeOfDay = timeOfDay;
        this.calendarDate = calendarDate;
        this.season = season;
        this.tickCount = tickCount;
        this.uncommittedEvents = [];
        this.version = version;
    }

    static create(worldId: WorldId): WorldClockAggregate {
        const now = new Date();
        const timeOfDay = TimeOfDay.create(now.getHours(), now.getMinutes(), now.getSeconds());
        const calendarDate = CalendarDate.create(now.getFullYear(), now.getMonth() + 1, now.getDate());
        const season = SeasonRef.fromCalendarDate(calendarDate);

        return new WorldClockAggregate(worldId, timeOfDay, calendarDate, season, 0, WorldEventVersion.initial());
    }

    static reconstitute(
        worldId: WorldId,
        timeOfDay: TimeOfDay,
        calendarDate: CalendarDate,
        season: SeasonRef,
        tickCount: number,
        version: WorldEventVersion
    ): WorldClockAggregate {
        return new WorldClockAggregate(worldId, timeOfDay, calendarDate, season, tickCount, version);
    }

    getWorldId(): WorldId {
        return this.worldId;
    }

    getTimeOfDay(): TimeOfDay {
        return this.timeOfDay;
    }

    getCalendarDate(): CalendarDate {
        return this.calendarDate;
    }

    getSeason(): SeasonRef {
        return this.season;
    }

    getTickCount(): number {
        return this.tickCount;
    }

    getVersion(): WorldEventVersion {
        return this.version;
    }

    getUncommittedEvents(): readonly IDomainEvent[] {
        return this.uncommittedEvents;
    }

    advanceTime(secondsToAdvance: number): void {
        if (secondsToAdvance <= 0) {
            throw new Error("Seconds to advance must be positive.");
        }

        const previousTime = this.timeOfDay.getTotalSeconds();
        const previousDate = this.calendarDate.toString();
        const previousSeason = this.season.getValue();

        const newTotalSeconds = previousTime + secondsToAdvance;
        const newTimeOfDay = TimeOfDay.fromTotalSeconds(newTotalSeconds);

        let newCalendarDate = this.calendarDate;
        if (newTimeOfDay.getTotalSeconds() < previousTime) {
            newCalendarDate = this.calendarDate.addDays(1);
        }

        const newSeason = SeasonRef.fromCalendarDate(newCalendarDate);

        this.timeOfDay = newTimeOfDay;
        this.calendarDate = newCalendarDate;
        this.season = newSeason;
        this.tickCount += 1;
        this.version = WorldEventVersion.next(this.version);

        this.uncommittedEvents.push(new TimeAdvancedEvent(
            this.worldId.getValue(),
            previousTime,
            newTimeOfDay.getTotalSeconds(),
            previousDate,
            newCalendarDate.toString(),
            previousSeason,
            newSeason.getValue(),
            Date.now(),
            ""
        ));
    }

    setTime(timeOfDay: TimeOfDay, calendarDate: CalendarDate): void {
        if (timeOfDay.getTotalSeconds() < this.timeOfDay.getTotalSeconds() && calendarDate.equals(this.calendarDate)) {
            throw new Error("Clock cannot move backward within the same day.");
        }

        const previousTime = this.timeOfDay.getTotalSeconds();
        const previousDate = this.calendarDate.toString();
        const previousSeason = this.season.getValue();

        this.timeOfDay = timeOfDay;
        this.calendarDate = calendarDate;
        this.season = SeasonRef.fromCalendarDate(calendarDate);
        this.version = WorldEventVersion.next(this.version);

        this.uncommittedEvents.push(new TimeAdvancedEvent(
            this.worldId.getValue(),
            previousTime,
            timeOfDay.getTotalSeconds(),
            previousDate,
            calendarDate.toString(),
            previousSeason,
            this.season.getValue(),
            Date.now(),
            ""
        ));
    }

    commitEvents(): void {
        this.uncommittedEvents.length = 0;
    }

    getSnapshot(): object {
        return {
            worldId: this.worldId.getValue(),
            timeOfDay: this.timeOfDay.toString(),
            calendarDate: this.calendarDate.toString(),
            season: this.season.getValue(),
            tickCount: this.tickCount,
            version: this.version.getValue()
        };
    }
}
