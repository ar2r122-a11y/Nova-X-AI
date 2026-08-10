export interface ITimeSimulationService {
    advanceTime(worldId: string, secondsToAdvance: number): Promise<import("../ValueObjects/TimeOfDay").TimeOfDay>;
    setTime(worldId: string, timeOfDay: import("../ValueObjects/TimeOfDay").TimeOfDay, calendarDate: import("../ValueObjects/CalendarDate").CalendarDate): Promise<void>;
    getCurrentTime(worldId: string): Promise<import("../ValueObjects/TimeOfDay").TimeOfDay>;
    getCurrentDate(worldId: string): Promise<import("../ValueObjects/CalendarDate").CalendarDate>;
}
