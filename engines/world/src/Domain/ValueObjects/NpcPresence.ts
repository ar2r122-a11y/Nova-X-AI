export class NpcPresence {
    private readonly characterId: string;
    private readonly locationId: string;
    private readonly arrivedAt: number;
    private readonly scheduledDeparture: number | null;

    private constructor(characterId: string, locationId: string, arrivedAt: number, scheduledDeparture: number | null) {
        this.characterId = characterId;
        this.locationId = locationId;
        this.arrivedAt = arrivedAt;
        this.scheduledDeparture = scheduledDeparture;
    }

    static create(characterId: string, locationId: string, arrivedAt: number, scheduledDeparture: number | null): NpcPresence {
        if (!characterId || characterId.trim().length === 0) {
            throw new Error("CharacterId cannot be empty.");
        }
        if (!locationId || locationId.trim().length === 0) {
            throw new Error("LocationId cannot be empty.");
        }
        if (arrivedAt < 0) {
            throw new Error("Arrival time cannot be negative.");
        }
        if (scheduledDeparture !== null && scheduledDeparture < arrivedAt) {
            throw new Error("Scheduled departure cannot be before arrival.");
        }
        return new NpcPresence(characterId, locationId, arrivedAt, scheduledDeparture);
    }

    getCharacterId(): string {
        return this.characterId;
    }

    getLocationId(): string {
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

    equals(other: NpcPresence): boolean {
        return (
            this.characterId === other.characterId &&
            this.locationId === other.locationId &&
            this.arrivedAt === other.arrivedAt &&
            this.scheduledDeparture === other.scheduledDeparture
        );
    }
}
