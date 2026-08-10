import { LocationId } from "../ValueObjects/LocationId";

export class NpcPresenceEntry {
    private readonly characterId: string;
    private readonly locationId: LocationId;
    private readonly arrivedAt: number;
    private readonly scheduledDeparture: number | null;

    private constructor(characterId: string, locationId: LocationId, arrivedAt: number, scheduledDeparture: number | null) {
        this.characterId = characterId;
        this.locationId = locationId;
        this.arrivedAt = arrivedAt;
        this.scheduledDeparture = scheduledDeparture;
    }

    static create(characterId: string, locationId: LocationId, arrivedAt: number, scheduledDeparture: number | null): NpcPresenceEntry {
        if (!characterId || characterId.trim().length === 0) {
            throw new Error("CharacterId cannot be empty.");
        }
        if (arrivedAt < 0) {
            throw new Error("Arrival time cannot be negative.");
        }
        if (scheduledDeparture !== null && scheduledDeparture < arrivedAt) {
            throw new Error("Scheduled departure cannot be before arrival.");
        }
        return new NpcPresenceEntry(characterId, locationId, arrivedAt, scheduledDeparture);
    }

    getCharacterId(): string {
        return this.characterId;
    }

    getLocationId(): LocationId {
        return this.locationId;
    }

    getArrivedAt(): number {
        return this.arrivedAt;
    }

    getScheduledDeparture(): number | null {
        return this.scheduledDeparture;
    }

    isPresentAt(timestamp: number): boolean {
        return timestamp >= this.arrivedAt && (this.scheduledDeparture === null || timestamp < this.scheduledDeparture);
    }
}
