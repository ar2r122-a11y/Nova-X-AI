import { StoryEvent } from "../../Domain/Events/StoryEvent";

export interface Upcaster {
    fromVersion: number;
    toVersion: number;
    upcast(event: StoryEvent): StoryEvent;
}

export class EventUpcaster {
    private upcasters: Upcaster[] = [];

    register(upcaster: Upcaster): void {
        this.upcasters.push(upcaster);
    }

    upcast(event: StoryEvent, fromVersion: number, toVersion: number): StoryEvent {
        let current = { ...event, payload: { ...event.payload } };
        let currentVersion = fromVersion;

        const applicable = this.upcasters
            .filter((u) => u.fromVersion === currentVersion && u.toVersion <= toVersion)
            .sort((a, b) => a.toVersion - b.toVersion);

        for (const upcaster of applicable) {
            current = upcaster.upcast(current as StoryEvent);
            currentVersion = upcaster.toVersion;
        }

        return current as StoryEvent;
    }
}
