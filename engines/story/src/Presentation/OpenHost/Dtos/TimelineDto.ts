export class TimelineDto {
    storyId: string;
    events: Array<{
        eventType: string;
        timestamp: number;
        version: number;
    }>;
    apiVersion: string;

    constructor(storyId: string, events: Array<{ eventType: string; timestamp: number; version: number }>, apiVersion: string = "v1") {
        this.storyId = storyId;
        this.events = events;
        this.apiVersion = apiVersion;
    }
}
